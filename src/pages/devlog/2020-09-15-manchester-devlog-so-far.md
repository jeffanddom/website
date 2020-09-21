---
templateKey: devlog-post
title: "Our progress so far: 35 streams in!"
date: 2020-09-15T15:04:10.000Z
description: Hey there, friend! Welcome to the Jeff and Dom Make a Game (heretofore JADMAG) devlog. Before you hit a big wall of prose, check out our new trailer!
featuredimage: /static/img/netplay-diagram.jpg
tags:
  - devlog
---

<div class="youtube-wrapper">
  <iframe src="https://www.youtube.com/embed/P5_FmXrgzGI" class="youtube-embed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The funny thing about maintaining a devlog for this project is that most devlogs are meant giving the audience a peek into the development process that they otherwise might not get to experience. Nearly 40 stream sessions in, it’s clear that JADMAG has been about nothing if not the process itself, warts and all. Scrub over to any moment in our archive, and you’ll find us banging our foreheads against some granular detail, usually a programming bug, but maybe also a trivial decision like deciding what color to use for the circles that pass as the game’s trees. If we had any goal at all when we started the stream, it was to demystify the process of making a game, certainly for ourselves, but mostly for other folks.

So, with a growing video archive that is stuffed to the gills with development minutiae, this devlog will likely be a space for us to step back and do some reflection, and compress the myriad design conversations, bugfixes, and digressions from the stream into something that’s a little more digestible

For our first entry, let’s talk a bit about where this project has been, and where it’s going.

# The concept

## The first game: Breakout

During the first handful of streams, we worked on Breakout. This is a classic starting point for game developers because the premise is simple, but getting it to feel right involves solving all kinds of interesting creative and technical problems. You have a ball, a paddle, and a bunch of bricks to destroy. Easy!

But wait…if the paddle moves at a constant speed, it feels kinda boring. If the ball just reflects its velocity when it hits something, then all you get are 45-degree angles. What happens when the ball hits two bricks at the same time? Shouldn’t we account for the paddle’s speed and direction of motion when it hits the ball? And so on and so forth. We quickly discovered that if we wanted to, we could spend months on just the physics and feel.

## The next game: Manchester

If we were going to spend months agonizing over minutiae, we wanted to do that for a game that had a bit more mechanical depth than Breakout. So, we thought, why not try our hand in making a Bolo clone?

Bolo was a multiplayer Mac game from the late 80s; playing it on a modern computer is a minor technical odyssey involving a 68k emulator and a bootleg OS image. It’s probably illegal but nobody cares. The game gave you a tiny tank to drive around, and you shot at other human- or AI-operated tanks. The handling was slippery and the graphics were primitive, even for the era. What made it compelling was a building-and-gathering mechanic that added a surprising amount of tactical complexity. You could build a handful of objects like boats, walls, and pillboxes, and employ them toward the primary goal of shooting at other tanks. This appealed to our nostalgia for real-time strategy games like Starcraft. It felt like you win in multiple ways: you could be really good at steering the tank, or you could be good at hiding in the trees while surrounding your enemy’s base with mines.

This was excellent fodder for investigation. From game design perspective, we traded the guesswork of tuning Breakout physics for implementing much simpler mechanics that could be combined in unexpected ways: shooting, hiding, building, and resource-gathering. It also seemed like a more complex and interesting production, requiring level design tools, systems for wrangling the interaction between many different kinds of objects, and not least, a robust multiplayer implementation.

We decided to call it “YoloRTS”. This was a bad pun that we rode for several dozen streams, until we gave it a new codename: Manchester. There were several reasons we chose this name that, when added together, still fall short of an interesting justification for the name. Suffice it say we just thought it sounded cool.

So far, we’ve implemented a ton of stuff for Manchester, and most if it during our twice-weekly two-hour streams. Here are some of the highlights:


- Mouse-and-keyboard driving/shooting mechanics that are basic but fun, for a couple minutes anyway
- AI-driven turrets that can kill the player
- The ability to hide from the baddies by driving into trees
- A rudimentary resource gathering and building mechanic
- Particle emitters, and a tool for designing them
- A map editor
- A debug draw system
- Pathfinding around obstacles
- A very homegrown but usable reinterpretation of entity-component-system architecture
- The beginnings of client/server multiplayer

That we’ve gotten so much done can be credited to the pair-programming structure, which really helps you spot bugs and unjam creative dilemmas. Being on a live stream is also a nice forcing function to get stuff done. All that said, what we’ve come up with so far still falls pretty far short of a game.

It’s worth a few words to discuss multiplayer, which is not only the most recent feature we’ve worked on, but also the one we’ve spent the most time on. There is some 
