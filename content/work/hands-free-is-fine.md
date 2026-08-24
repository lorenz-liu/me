---
title: "Hands-Free Is Fine: Gaze-Dominant Object Manipulation in Virtual Reality"
date: "2023-07-25"
tech: "Unity3D, C#, Virtual Reality (VR), Human-Computer Interaction (HCI), Eye Tracking, Gaze Interaction, Finite State Machine, Hands-free Manipulation, Signal Filtering, User Study"
pdf: "/pdf/hands-free-is-fine.pdf"
---

Hand-based object manipulation is the default in VR, yet it fails when users have limited mobility or when their hands are occupied. We present a fully hands-free pipeline for 6DOF object manipulation driven primarily by gaze, with head motion and double-blink confirmation closing the interaction loop.

The system is modeled as a finite state machine spanning idle browsing, object selection, mode switching, and active manipulation. Core components and findings include:
* **Gaze-Dominant Pipeline**: Users aim with head-forward ray casting, confirm selection with a rapid double blink, then translate, rotate, or rescale objects through continuous gaze and head mappings without controllers or hand gestures.
* **Clover Mode Switching Menu**: A four-way gaze menu spawned after selection lets users switch among translating, rotating, and rescaling—or cancel—via dwell-based confirmation, avoiding a full restart of the selection flow.
* **Signal Conditioning**: Eye-tracking noise is filtered; a gaze adaptation function amplifies large motions while attenuating small ones; and an eye–head fixation optimization reduces cognitive load during continuous manipulation.
* **Empirical Gains**: Against OrthoGaze on single-object translation, the method improved completion time, SSQ, SUS, and NASA-TLX. In a block-building task requiring translation, rotation, and scaling, it matched Implicit Gaze and outperformed PRISM on efficiency, with an 85.7% success rate.

Together, these results show that gaze-dominant, hands-free 6DOF manipulation can rival strong hand-based techniques while remaining usable when the hands are unavailable.
