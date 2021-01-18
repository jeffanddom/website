---
title: How Jeff and Dom make the game
date: 2021-01-07
aliases:
  - 2021-01-07-how-jeff-and-dom-make-the-game
description: An overview of some of the tools we use to build the game.
summary: |
  As a multiplayer game, [Manchester](https://github.com/jeffanddom/manchester) has to run both in-browser and server-side. This post explores how we convert TypeScript into runnable programs for both environments, how we automate builds and reloads for a better developer experience, and some tricks we've discovered for improving build performance, like using [esbuild](https://esbuild.github.io/) and moving builds into the cloud.

  ![](/img/devlog/20210107-autoreload.gif)
tags:
  - manchester
  - tools
  - build
---

Holy heck, it's January! Congrats to everyone for making it to 2021.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609724615677_Screen+Shot+2021-01-03+at+5.43.00+PM.png)

[Manchester](https://github.com/jeffanddom/manchester) (the working title for our current project) is still more tech demo than game, but it's come a really long way in the past six months. We've arrived at a multiplayer architecture that seems pretty workable, and for the past month we've been converting the game to 3D, throwing out most of the old rendering code in the process. More importantly, Dom and I are finally getting our sea legs. We started off being pretty clueless about everything, but we've managed to build up a little foundation of knowledge about how these systems work and how they fit together, and we're hoping to post more articles about all the stuff we've learned.

This post explores some of the tools we use to build and develop the game. We're using borrowed 3D models and don't have a complex asset pipeline, so this mostly concerns how we convert TypeScript source into a playable game, and how that fits into our development workflow.

One interesting problem with building Manchester is that it's actually two different programs, a client and a server. The client runs in the browser, the server runs via the Node runtime, and the two talk to each other over a websocket. While each program has some exclusive capabilities (only the client can use WebGL, for example), both can run the full game simulation. As a result, they're not identical artifacts, but they share a lot of code.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609722621165_Screen+Shot+2021-01-03+at+5.10.13+PM.png)

At the most basic level, our build system converts the game's TypeScript to JavaScript, and assembles the resulting JavaScript files into a couple of asset bundles that run in different runtime environments. But we also rely on the build system to provide a tight edit-build-reload loop, so we can iterate on game features without getting distracted with manual drudgery and long build times. This means that the build system also has to rebuild and reload the game automatically in response to changes, and it has to do those things fairly quickly.

## Bundling code as fast as possible

Until very recently, we used [Parcel](https://parceljs.org/) to generate both the client and server bundles. Parcel has pretty sensible default behavior, which reduces the amount of customization you have to do. Its API also largely avoids being a soup of abstractions, so when you do have to customize, it's not that hard. The first time I ever used it, it seemed quite magical when compared to the stodgy unfriendliness of Webpack.

To build a client and server versions of the game, we just point Parcel at two different "entrypoint" files, and set a single flag for each indicating whether we're targeting the browser or Node. Parcel then recursively traverses the import statements for each entrypoint and spits out two different bundles, ready for runtime.

Unfortunately, Parcel is pretty slow. I'm skeptical that it was ever as "blazing fast" as its website claims. Manchester is currently around 8000 lines of TypeScript not counting comments, which is to say not very big at all. A clean Parcel build takes over 20 seconds on my 2017 MacBook Pro. Incremental builds are better, maybe between 5-10 seconds, which is tolerable but far from snappy. It's hard to imagine good outcomes as we add more stuff--the codebase might be several times its current size if we get anywhere close to what we're hoping to do.

Lately, a lot of new JavaScript tools seem to be popping up on the radar, all reflecting a philosophy of chucking the last decade's worth of received wisdom around frontend tooling. You've got [esbuild](https://esbuild.github.io/) and [swc](https://github.com/swc-project/swc), two transpiling bundlers written in Go and Rust respectively, that both abandon the age-old tradition of implementing JavaScript tooling in JavaScript itself. Then there's [Rome](https://rome.tools/), which doesn't ditch JavaScript as an implementation language, but appears to ditch just about everything else in the conventional JS toolchain.

Despite the grand promises of these new tools, I'd always avoided trying to replace Parcel--it seemed like it would be painful to change such a core piece of the build, especially if the alternatives weren't fully baked. But while researching this post, I set aside a little time to give esbuild a shot. Just a tiny toe-dip to see what the water felt like.

The results were _staggering_. In less than an hour, I [merged a change](https://github.com/jeffanddom/manchester/commit/97d2b86b9b8158845236267efcca2d2c0c8cfcbc) that replaced Parcel with esbuild, yielding build times that feel pretty darn close to the [two-order-of-magnitude speedup](https://esbuild.github.io/faq/#why-is-esbuild-fast) advertised on esbuild's website. I didn't do any profiling except to observe that the build is now essentially instantaneous. It makes me feel like the community should strongly consider not using JavaScript anymore for writing nontrivial tools. Yes, I'm looking at you, official TypeScript typechecker!

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609720604373_Screen+Shot+2021-01-03+at+4.36.39+PM.png)

Almost as impressive as the performance gain was the ease of migration. Our requirements aren't really that demanding, but I honestly expected to hit some annoying snag that would cause me to drop the whole idea immediately. Instead, what I got was a near drop-in replacement. We have fewer lines of code dedicated to esbuild than we did to Parcel. I'm guessing esbuild enjoys the latecomer's advantage of emulating the patterns of its predecessors, and maybe avoiding their anti-patterns too.

## Development server

With bundling out the way, the next thing to address is getting code changes to automatically trigger rebuilds. Most bundler systems, Parcel and esbuild included, give you a "development server" that runs in a terminal tab, watching your code for changes and rebuilding the project when appropriate. Some tools will even automatically reload programs running in the browser, so you don't have to.

For a while, we were quite happily chugging away with Parcel's version of this. This changed when Manchester became a multiplayer game, and we had to run a Node server on top of the browser client. Suddenly, we had two artifacts to build, and on top of that, we needed the server piece to be able to deliver the client artifact over HTTP.

I tried and failed to find a bundler with a dev server that makes this arrangement seem even remotely doable. Rather than try to bend someone else's dev server to our will, we decided just to write our own. Manchester's homegrown [dev server](https://github.com/jeffanddom/manchester/blob/9efb11e163b3919a9759984a1e52aa8d67e7272c/src/cli/build/dev.ts) acts as a supervisor for three processes: a [client bundler](https://github.com/jeffanddom/manchester/blob/9efb11e163b3919a9759984a1e52aa8d67e7272c/src/cli/build/buildClient.ts), a [server bundler](https://github.com/jeffanddom/manchester/blob/9efb11e163b3919a9759984a1e52aa8d67e7272c/src/cli/build/buildServer.ts), and the game server itself. It listens to our source directory for file change events, and when they occur, it runs the bundlers to produce new artifacts. When both are done, it restarts the game server.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609723042125_Screen+Shot+2021-01-03+at+5.17.10+PM.png)

The dev server does all of the above in a very literal, straightforward fashion, and when I reflect on similar projects I worked on in the past--i.e., a JS client and Node server that share code and talk to each other--I wish I'd been willing to take this route earlier. That said, there are a couple of interesting gotchas to call out.

First, when triggering actions off of high-frequency events like file system changes, it's important to do some debouncing. This means that instead of triggering a build as soon you receive a file system event, you can schedule a build a short time into the future. If you receive a subsequent event, you can check to see if a build is already scheduled, and if so, ignore the new event. I found this surprisingly subtle to get right, but it's a useful pattern to have in the bag. Any UI that handles mouse clicks and keypresses (like a video game!) is likely to need some debouncing in order to be tolerable to the user.

Second, while it's good to avoid adding dependencies when they're not absolutely necessary, I recommend using [chokidar](https://www.npmjs.com/package/chokidar) if you're using JavaScript and are in the business of subscribing to file system events. Node's standard library seems to offer a nice, simple solution in [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener), but it [doesn't actually work on Linux](https://nodejs.org/api/fs.html#fs_caveats), which seems kind of like a big deal.

## Auto-restarting the client

So, we've got a dev server that can rebuild artifacts and restart the game server. However, it can't talk to the client running in a browser tab, so it doesn't have a direct way to restart the client.

We solve this by letting the client poll the game server every few seconds to see if there's a new build available. The game server already serves the client artifact via HTTP, so it knows when a new client artifact has been generated by the bundler. If the server reports a different build version to what the client is running, the client triggers a page reload.

![](/img/devlog/20210107-autoreload.gif)

Our concept of a "build version" is pretty basic: it's just a timestamp of when a build was triggered. There's probably a content-addressable version of this, a CRC or something, that offers optimal correctness, but a timestamp is easy to generate and works just fine. Before creating the client bundle, the dev server writes the build version into a string that gets rolled into the client code. In other words, each client artifact is hard-coded with its build version. The dev server also writes the build version to a file that the game server can read, so the game server knows how to respond the next time the client asks for the current build version.

Right now, neither the client nor the server has any persistent state, so a full reload on both sides is the most we can do. Which is nice and simple! Once the game gets deeper, though, we're probably going to need more complex semantics around what it means to "reload", and maybe have different types of reloads depending on what kind of changes were made in the build. It seems like a hard thing to get right. A lot of in-development games don't bother systematizing this kind of thing, and instead just make it easy for the developer to jump around once the game has reloaded, via debug menus, cheat codes, etc.

## Developing in the cloud

In addition to replacing Parcel, we also looked into improving build performance the old-fashioned way: throwing more hardware at the problem. During one of our Twitch streams, we run not only the development server, but a slew of other resource-hungry programs: the game server, the game client, VSCode, a TypeScript LSP server, Zoom with screenshare and virtual backgrounds, maybe Quicktime mirroring an iPad whiteboard, and now that we're doing 3D graphics, we can throw Blender into the mix too. The processes really add up. Triggering a build in the middle of all this can tangibly degrade game performance, stream quality, and VSCode's responsiveness.

The silver lining to living in a cyberpunk dystopia is that you can rent CPU cores with nothing more than a handful of AWS API calls. Not a bad silver lining if you're making a video game! Since the dev server, game server, and bundlers are all just Node programs, we realized we could run them all in the cloud to free up compute power for local processes.

The first hurdle is having a way to edit code locally while ensuring that the changes promptly make it to the remote host. Luckily, this seems to be a solved problem these days. VSCode can do it through its [remote SSH extension](https://code.visualstudio.com/docs/remote/ssh), and it basically just works.

The other big hurdle is figuring out how to do it without losing an arm and a leg. EC2's pricing chart is attractively cheap at first glance, but you learn not to be fooled after leaving a superfluous instance running through a long weekend. We wanted to avoid spending a dime more than we had to.

Our solution is to a) use spot instances (a 90% discount off the regular price, most of the time), and perhaps more importantly b) make sure to terminate the instances as soon as you're done using them. We came up with a script called [`cloud-dev`](https://github.com/jeffanddom/manchester/tree/9efb11e163b3919a9759984a1e52aa8d67e7272c/src/cli/cloud-dev) that launches an EC2 instance and wires it to your local machine. The script blocks until you ctrl-c out or close the terminal tab, at which point it terminates the remote host.

The workflow ends up looking like this:

1. Run `cloud-dev` its own terminal tab.
2. Activate a remote session in VSCode.
3. Use the VSCode terminal tab to SSH into the instance, and start the dev server.
4. Edit code until you hit a hard problem and decide that it would be more fun to go get a cup of coffee.
5. From the SSH session, close the dev server and push your changes to origin. Do your best to write a good commit message, but boy does that cup of coffee sound good right now. Maybe this time you'll say something hilarious to the barista!
6. Terminate the `cloud-dev` script.

Here's what a `cloud-dev` session looks like:

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1609654667645_Screen+Shot+2021-01-02+at+10.06.01+PM.png)

The script has accreted a bunch of automatic behaviors to make it more usable:

- The script auto-mounts EBS volumes--Dom and I each have one, and the script figures out which one to mount based on our respective AWS credentials. It's okay if remote hosts come and go, but it helps for the storage to be persistent, so you don't have to clone the source repo every time, and you don't have to worry about losing work if you forget to commit and push.
- Starting new EC2 instances guarantees you'll get a different hostname every time, so the script updates your local SSH configuration with a host alias that's stable from session to session. This saves you from having to copy and paste hostnames.
- In a similar vein, the script forwards traffic from a local TCP port to the remote game server, so you can play the game by opening a localhost URL.
- Using `git fetch` and `git push` through the remote session means your SSH identity needs to be available remotely, so the script also automatically updates the local SSH config to enable [agent forwarding](http://unixwiz.net/techtips/ssh-agent-forwarding.html).
- Yet more SSH shenanigans: to prevent the inevitable SSH "Do you trust these new host keys?" prompt, the script automatically updates the local `known_hosts` file with the remote host's public keys. I believe this is safe practice, or at least no more dangerous than the non-automated alternative, given that a) the host just got created, and b) I've never had the insight or wherewithal to respond to that prompt with anything other than an immediate `yes`.
- As a bonus convenience, the script also uploads your `.gitconfig`, so commits created from the remote host get attributed to you. We got tired of seeing commits in git history authored by someone called "Ubuntu".

One thing I haven't got around to making, but would give us some peace of mind, is a cronjob that kills any instances that have been hanging around for more than, say, 12 hours. This would serve as a backup for times when the script fails clean up the EC2 instance. It hasn't happened yet, but I probably just jinxed myself in saying so.

As far as costs are concerned, it's been pretty darn affordable so far, with the caveat that we're not using this as a daily driver yet. Currently, we're using `c5.xlarge` instances, whose typical spot prices weigh in at a hair over $0.06 per hour. We probably launched and terminated a hundred instances while testing this out, and paid a grand total of $2.15 for the month.

## So how's that been working out for you, buddy?

All in all, these tools have been serving us pretty nicely! We get fairly immediate feedback on changes to source, which is hopefully something we can sustain over the lifetime of the project. We'll occasionally observe some flaky builds where it's hard to tell whether there's an actual bug or something went sideways with the bundle. Those kinds of things are most likely due to race conditions, which are hopefully less likely now that esbuild has improved build times so much.

It remains to be seen whether our cloud development tool is something we'll start to rely on outside of our Twitch streams. But the developer experience is already smooth enough to be usable, and it does help to take load off of our laptops.

From here on out, our tooling effort is likely to shift away from bundling code and toward processing and editing assets. In particular, neither our level editor nor particle emitter tool has survived the transition to 3D, and those seem like pretty important things to fix!
