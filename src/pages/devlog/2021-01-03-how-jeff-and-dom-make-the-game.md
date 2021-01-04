---
templateKey: devlog-post
title: Devlog 2 - How Jeff and Dom make the game
date: 2021-01-04T17:00:00.000Z
description: An overview of some of the tools we use to build the game.
excerpt: |
  Holy heck, it’s January! Congrats to everyone for making it to 2021. This post is about some of the tools we use to build and develop the game.

  ![](/devlog/20210104-autoreload.gif)
tags:
  - manchester
  - tools
---

Holy heck, it’s January! Congrats to everyone for making it to 2021.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609724615677_Screen+Shot+2021-01-03+at+5.43.00+PM.png)

Manchester (the game’s working title) is still more tech demo than game, but it’s come a really long way in the past six months. We’ve arrived at a multiplayer architecture that we’re comfortable with, and for the past month or so we’ve been converting the game to 3D, throwing out most of the old rendering code in the process. More importantly, Dom and I have accumulated a fair bit of knowledge about how these systems work and how they fit together, and we’re hoping to post some deep-dive articles on all the stuff we’ve learned.

This post is about some of the tools we use to build and develop the game. We’re using borrowed 3D models and don’t have a complex asset pipeline, so this mostly concerns how we convert TypeScript source code into a playable game, and how that fits into our development workflow.

Manchester is composed of two TypeScript programs, a client and a server. The client runs in the browser, the server runs via the Node runtime, and the two talk to each other over a websocket. While each program has some exclusive capabilities (only the client can use WebGL, for example), both can run the full game simulation and therefore share a lot of code.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609722621165_Screen+Shot+2021-01-03+at+5.10.13+PM.png)

At the most basic level, our build system converts TypeScript to JavaScript, and assembles the resulting JavaScript files into a couple of asset bundles that run in different runtime environments. But we also rely on the build system to provide a tight edit-build-reload loop, so we can iterate on game features without getting distracted with manual drudgery and long build times. This means that the build system also has to automatically rebuild and reload the game when changes occur, and it has to those things fairly quickly.

## Bundling code as fast as possible

Up until very recently, we used [Parcel](https://parceljs.org/) for generating both the client and server bundles. Parcel has pretty sensible default behavior, which reduces the amount of customization you have to do. The API also largely avoids being a soup of abstractions, so when you do have to customize, it’s not that hard. The first time I ever used it, it seemed magical in comparison to Webpack.

Unfortunately, Parcel is pretty slow. I am skeptical that it was ever as “blazing fast” as its website claims. Manchester is 8000 lines of TypeScript not counting comments, which is to say not very big at all. A clean Parcel build for our client and server bundles takes over 20 seconds on my 2017 MacBook Pro. Incremental builds are better, maybe between 5-10 seconds, which is tolerable but far from snappy. It’s hard to imagine good outcomes as we add more stuff—the codebase might be several times its current size if we get anywhere close to what we’re hoping to do.

Lately, a lot of new JavaScript tools seem to be popping up on the radar, all reflecting a philosophy of lustily chucking received wisdom. You’ve got [esbuild](https://esbuild.github.io/) and [swc](https://github.com/swc-project/swc), two transpiling bundlers, written in Go and Rust respectively, that abandoned the age-old tradition of implementing JavaScript tooling in JavaScript itself. Then there's [Rome](https://rome.tools/), which doesn’t do away with JavaScript as an implementation language, but appears to do away with just about everything else in the conventional JS toolchain. Despite all this, I’d always avoided trying to replace Parcel—it seemed like it would be painful to change such a core piece of the build, especially if the replacement wasn’t really mature. It felt like there were bigger fish to fry.

Nonetheless, while researching this post, I decided to take an afternoon and give esbuild a shot. The results were staggering. In less than an hour, I [merged a change](https://github.com/jeffanddom/manchester/commit/97d2b86b9b8158845236267efcca2d2c0c8cfcbc) that replaced Parcel with esbuild, yielding build times that feel pretty darn close to the [two-order-magnitude speedup](https://esbuild.github.io/faq/#why-is-esbuild-fast) advertised on esbuild’s website. I didn’t do any profiling except to observe that the build now feels basically instantaneous. It makes me feel like the community should strongly consider not writing nontrivial tools in JavaScript anymore. Yes, I’m looking at you, official TypeScript typechecker!

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609720604373_Screen+Shot+2021-01-03+at+4.36.39+PM.png)

Almost as impressive as the performance gain was the ease of migration. Our requirements aren’t really that demanding, but I honestly expected a huge headache that I’d just punt deep into the future. Instead, what I got was a near drop-in replacement. We now have fewer lines of code dedicated to esbuild than we did to Parcel. I’m guessing esbuild has enjoyed the latecomer’s advantage of emulating the patterns of builder systems that came before it.

## Development server

With bundling out the way, the next thing to address is automatic rebuilds triggered by code changes. Most bundler systems, Parcel and esbuild included, give you a “dev server” that runs in a terminal tab, watching your code for changes and rebuilding the project when appropriate. Some tools will even automatically reload programs running in the browser, so you don’t have to.

For a while, we were quite happily chugging away with Parcel’s version of this. This changed when Manchester became a multiplayer game, and we had to run a Node server on top of the browser client. Suddenly, we had two artifacts to build, and the server piece had to be able to deliver the client artifact over HTTP. I have tried and failed to locate a bundler with a dev server that makes this arrangement seem even remotely doable.

Rather than try to bend someone else’s dev server into a pretzel, we decided to just write our own. Manchester’s dev server acts as a supervisor for three processes: a client bundler, a server bundler, and the game server itself. It listens to our source directory for file change events, and when they occur, it runs both the client and server bundler. When both are done, it restarts the game server using the new artifacts.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609723042125_Screen+Shot+2021-01-03+at+5.17.10+PM.png)

The dev server does all of the above in a very literal, straightforward fashion, and when reflecting on other similar projects I’ve worked on—i.e., a JS client and Node server that talk to each other and share code—I wish I’d been willing to take this route earlier. That said, there are a couple of interesting gotchas to call out.

First, when triggering actions off of high-frequency events like file system changes, it’s important to do some debouncing. This means instead of triggering a build as soon you receive a file system event, you can schedule a build a short time into the future. If you receive a subsequent event, you can check to see if a build is already scheduled, and save yourself from doing another build. I found this surprisingly subtle to get right, but it’s a useful pattern to practice. Any UI that handles mouse clicks and keypresses (like a video game!) is likely to need some debouncing to be tolerable to the user.

Second, while it’s good to avoid adding dependencies where they’re not absolutely necessary, I recommend using [chokidar](https://www.npmjs.com/package/chokidar) for subscribing to file system events. Node’s standard library has [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener), which seems to fit the bill and has a nice API to boot, but sadly [doesn’t seem to work on Linux](https://nodejs.org/api/fs.html#fs_caveats).

## Auto-restarting the client

So, we’ve got a dev server that can rebuild artifacts and restart the server. However, it can’t talk to the client running in a browser tab, so it doesn’t have a direct way to restart the client.

We solve this by letting the client poll the game server every few seconds to see if there’s a new build available. The game server already serves the client artifact via HTTP, so it has direct knowledge of when a new client artifact has been generated by the bundler. If the server reports a different build version to what the client is running, the client triggers a page reload.

![](/img/devlog/20210104-autoreload.gif)

Our concept of a “build version” is simple: it’s just a timestamp of when a build was triggered. Before creating the client bundle, the dev server writes the build version into a JS file imported by the client code; in other words, each client artifact is hard-coded with its build version. The dev server also writes the build version to a file that the game server can read, so it knows what to tell the client when the client asks.

Right now, neither the client nor the server has any persistent state, so a full reload on both sides is the most we can do. Which is nice and simple! Once the game gets deeper, though, we’re probably going to need a more complicated semantics around what it means to “reload”, and maybe have different types of reloads depending on what kind of changes were made in the build. It seems like a hard thing to get right. A lot of in-development games don’t bother systematizing this kind of thing, and instead just make it easy for the developer to jump around (via cheat codes, consoles, debug menus, etc.) once the client has reloaded.

## Developing in the cloud

Along with replacing Parcel, our other idea for improving build performance has been to throw more hardware at the problem. During one of our Twitch streams, we’re running not only the development server, but a host of other impressively needy programs: the game server, the game client, VSCode, a TypeScript LSP server, Zoom with screenshare and virtual backgrounds, maybe Quicktime mirroring an iPad whiteboard, and now that we’re doing 3D graphics, we can throw Blender into the mix too! Triggering a build in the middle of all this can tangibly degrade game performance, stream quality, and VSCode’s responsiveness.

The silver lining of living in a cyberpunk dystopia is that you can rent CPU cores with nothing more than a handful of AWS API calls. Not a bad silver lining if you’re making a video game! Since the dev server, game servers, and bundlers are all just Node programs, we realized we could run them all in the cloud and free up compute power for local processes. We just needed a way to edit code locally but have it show up in a cloud host. Luckily, VSCode can do it through its [remote SSH extension](https://code.visualstudio.com/docs/remote/ssh), and it mostly just works.

The trick is to figure out how to do it without losing an arm and a leg. EC2’s pricing chart is attractively cheap at first glance, but you learn not to be fooled after leaving a superfluous instance online over a long weekend. I wanted to avoid spending a dime more than we had to.

We accomplish this by using spot instances (a 90% discount off the regular price, most of the time), and perhaps more importantly, terminating the instances as soon as we weren’t using them. We came up with a script called `cloud-dev` that launches an EC2 host and installs some wiring into your local computer, and terminates the host when you ctrl-c out of the script or close the terminal tab. The workflow looks like this:

1. Run `cloud-dev` its own terminal tab.
2. Attach to the remote instance in VSCode.
3. Use a VSCode terminal tab to SSH into the instance, and start the dev server.
4. Edit and develop into you hit a hard problem and decide that it would be more fun to go get a cup of coffee.
5. From the SSH session, close the dev server and push your changes to origin.
6. Terminate the `cloud-dev` script.

Here’s what `cloud-dev` looks like:

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609654667645_Screen+Shot+2021-01-02+at+10.06.01+PM.png)

The script has accreted a bunch of small features to make it more usable:

- Dom and I each have our own EBS volumes so our cloud-hosted data doesn’t go away when the EC2 hosts get terminated. Mounting an EBS volume to a brand new EC2 instance means the game repository is available right off the bat, and lets us pick up where we left off in case we forgot to push our changes last time.
- The script uses `ssh-keyscan` to pull down the new host’s pubkeys into the local `~/.ssh/known_hosts`, so you don’t get the “Do you trust this host” prompt. I believe this is safe practice, or at least no more dangerous than the non-automated alternative, given that a) the host just got created, and b) I have never in my career had the insight or wherewithal to respond to that prompt with anything other than an eager and immediate `yes`.
- More `ssh` shenanigans: The script automatically updates the local `~/.ssh/config` with a binding between the new host’s public domain and a local alias, `jeffanddom-cloud-dev`. This gives our cloud development host a stable name to point at, even though the actual instance changes with every session. It also inserts a directive to provide SSH agent forwarding, so `git fetch` and `git push` work when executed from the remote host.
- The script also uploads your local `.gitconfig`, so commits created from the remote host get appropriate attribution. We got tired of seeing commits in git history authored by someone called “Ubuntu”.
- Finally, the script also sets up forwarding between a local TCP port to the remote game server, so you can play the game using a `localhost` URL.

One thing I never got around to making, but would probably give me a bit more peace of mind, is a cronjob that kills any instances that have been hanging around for more than, say, 12 hours or so—any host hanging around that long has only done so by mistake.

As far as costs are concerned, so far it seems not too bad, with the caveat that we’re not using this as a daily driver yet. Currently, we’re using `c5.xlarge` instances on spot, which weigh in at a hair over $0.06 per hour. I probably launched and terminated a hundred instances while testing this out, and paid a grand total of $2.15 for the month.

## So how’s that been working out for you, buddy?

All in all, these tools have been serving us pretty nicely. We get fairly immediate feedback on changes to source, which is hopefully something we can sustain over the lifetime of the project. We’ll occasionally observe some flaky builds where it’s hard to tell whether there’s an actual bug or something went sideways with the bundle. Those kinds of things are usually due to race conditions, and we’ll hope those will be less likely now that the build has gotten faster. It remains to be seen whether our cloud development tool is something we’ll start to rely on outside of our Twitch streams, but the developer experience is smooth enough to be usable, and it does help to take load off of our overworked laptops.

From here on out, our tooling effort is likely to shift away from bundling code and toward processing and editing assets. In particular, neither our level editor and particle emitter tool survived the transition to 3D, and those seem like pretty important things to have.
