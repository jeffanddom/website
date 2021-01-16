---
title: Devlog 1 - September 2020
date: 2020-09-29
aliases:
  - 2020-09-28-manchester-devlog-so-far
description: Our first devlog entry! We've got a new trailer for our Twitch stream (https://jeffanddom.com/trailer), and a quick overview of where we've been and where we're going next.
tags:
  - manchester
  - breakout
  - multiplayer
---

Hey there, friend! Welcome to the Jeff and Dom Make a Game (heretofore JADMAG) devlog. Before you hit a big wall of prose, check out our new trailer!

{{< youtube-embed z8e_cUsJyxM >}}

<!--more-->

The funny thing about maintaining a devlog for this project is that most devlogs are meant giving the audience a peek into the development process that they otherwise might not get to experience. Nearly 40 stream sessions in, it’s clear that JADMAG has been about nothing if not the process itself, warts and all. Scrub over to any moment in our archive, and you’ll find us banging our foreheads against some granular detail, usually a programming bug, but maybe also a trivial decision like deciding what color to use for the circles that pass as the game’s trees. If we had any goal at all when we started the stream, it was to demystify the process of making a game, certainly for ourselves, but mostly for other folks.

So, with a growing video archive that is stuffed to the gills with development minutiae, this devlog will likely be a space for us to step back and do some reflection, and compress the myriad design conversations, bugfixes, and digressions from the stream into something that’s a little more digestible

For our first entry, let’s talk a bit about where this project has been, and where it’s going.

## The first game: Breakout

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1600918628935_Screen+Shot+2020-09-23+at+8.34.55+PM.png)

Early on, we worked on Breakout. This is a classic starting point for game developers because the premise is simple, but getting it to feel right leads to a bunch of interesting creative and technical problems. You have a ball, a paddle, and a bunch of bricks to destroy. Easy! But wait…if the paddle moves at a constant speed, it feels kinda boring. If the ball just reflects its velocity when it hits something, then all you get are 45-degree angles. What happens when the ball hits two bricks at the same time? Shouldn’t we account for the paddle’s speed and direction of motion when it hits the ball? And so on and so forth. We quickly discovered that if we wanted to, we could spend months on just the physics and feel.

## The next game: Manchester

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1600919321908_Screen+Shot+2020-09-23+at+8.48.26+PM.png)

If we were going to spend months agonizing over minutiae, we wanted to do that for a game that had a bit more mechanical depth than Breakout. So, we thought, why not try our hand in making a [Bolo](https://en.wikipedia.org/wiki/Bolo_(1987_video_game)) clone?

Bolo was a multiplayer Mac game from the late 80s. Playing it on a modern computer is a minor technical odyssey involving a 68k emulator and a bootleg OS image. The game gave you a tiny tank to drive around, and you shot at other human- or AI-operated tanks. The handling was slippery and the graphics were primitive, even for the era. But this belied its unusually deep and engaging gameplay.

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1600918701387_Pillwar.png)

What made it compelling was a building-and-gathering mechanic that added a surprising amount of tactical complexity. You could build a handful of objects like boats, walls, and pillboxes, and employ them toward the primary goal of shooting at other tanks. This appealed to our nostalgia for real-time strategy games like Starcraft. It felt like you win in multiple ways: you could be really good at steering the tank, or you could be good at hiding in the trees while surrounding your enemy’s base with mines.

We decided that Bolo was an excellent model on which to base a new game. From game design perspective, we traded the guesswork of tuning Breakout physics for implementing much simpler mechanics that could be combined in unexpected ways: shooting, hiding, building, and resource-gathering. It also seemed like a more complex and interesting production, requiring level design tools, systems for wrangling the interaction between many different kinds of objects, and not least, a robust multiplayer implementation.

We decided to call it “YoloRTS”. This was a bad pun that we rode for several dozen streams, until we gave it a new codename: Manchester. There were several reasons we chose this name that, when added together, still fall short of an interesting justification for the name. Suffice it say we just thought it sounded cool.

So far, we’ve implemented a ton of stuff for Manchester, and most if it during our twice-weekly two-hour streams. Here are some of the highlights:

- Mouse-and-keyboard driving/shooting mechanics that are basic but fun, for a couple minutes anyway.
- AI-driven turrets that can kill the player.
- A rudimentary resource gathering and building mechanic.
- Particle emitters, and a tool for designing them.
- A map editor.
- Pathfinding around obstacles.
- The beginnings of a client/server multiplayer architecture.

That we’ve gotten so much done, in a relatively small number of hours, can be credited to the pair-programming structure, which really helps you spot bugs and unjam creative dilemmas. Doing the work on a live stream is also a nice forcing function to get stuff done. All that said, what we’ve come up with so far still falls pretty far short of a game.

For the short-term, we’ll be focusing on multiplayer. Multiplayer is notoriously difficult to implement, and it’s definitely been the most challenging thing we’ve worked on. The conventional wisdom is that your multiplayer architecture dictates the architecture for the rest of the game, which means the later you wait to add it, the harder it gets to add. On the plus side, we’ve started early! On the minus side, it means that the stream will continue to be a little one-note. Multiplayer implementation is interesting in a lot of ways, but it’s not always that interesting to watch.

After that, we’re thinking of another major overhaul. Manchester’s graphics are primitive shapes powered by the [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). The simplistic visuals have their charms, but we’ve always considered them to be for prototyping only. Eventually, we’d like to adopt a 3D wireframe aesthetic, not unlike Battlezone, another classic tank game from the 80s.

![](https://uc7184d123156fa60927930e1332.previews.dropboxusercontent.com/p/thumb/ABD7joEAyCmCSA_7QGdkUmsbkzs9ew8j7ufz-rl2WCo-K6fOCR-FWDT-J5l5GRejpjUH30ytUAlkYBcYOttjN4IcO5YnJn3qeyBnHn9ZKw6APyLXtjZIm9VdB4bGPWO-hrMfwwIUZ686oXT9X8QKfnomGFVDGqqlT_uD9OvYNbUcjSACteM-qvqEBi6qgCuaWh4-pvl6g494rzI10fmh4Dj1_PnZ5vuQXXQ41ZCGbsJcjA-JI1CCw5GCFuMVQZTMhyMWOdSidtAmbPDr4VPVHTV0uTYiG5uF2sZ8riEKGQ94IWIOu6Svw5_Lw0e3SwH3jXOwt1bm_XEfTqa7ukgGdB_JVawyEcNJhaJ0mIGu27DsugDKtKNXu8NvYii9VILuLVzJISpQ7OkJD5_cWNKbWMSeIU2vnNovxj8YWdkyBrB5PLW__M0FzCxrcBJfxWmeMVk/p.jpeg)


A solid multiplayer implementation and a strong visual aesthetic should form a pretty solid foundation to build an actual game, not unlike the first two circles that make up a drawing of an owl. After that, it’s a simple matter of building an actual game out of it!

![](https://paper-attachments.dropbox.com/s_2D26CFCFC1A50FAAA131CE2FDABB0884BD80263FA1E7E2924E10BB4715669F45_1600920596136_d6d.jpg)
