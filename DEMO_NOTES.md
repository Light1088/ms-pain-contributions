# Gameplay Mechanics — Browser Adaptation

**[Open the live demo](https://light1088.github.io/ms-pain-contributions/)**
This demonstration adapts selected rules from the supplied MS Pain source. It is not a port of the complete PainterEngine game, and it contains no team artwork or engine code.

| Browser feature | Original implementation reference |
| --- | --- |
| Movement between endpoints with reversal | VerticalMovingPlatform.cs: normalised progress, speed × delta time / path length, interpolation, direction reversal and starting phase. |
| Swap replenishment only during contact | ExtraSwapItem.cs: enter/exit contact flag and an E-key increment below MAX_SWAPS. |
| Four-swap cap | PlayerMovementController.cs: MAX_SWAPS = 4. |
| C-key refill for testing | CheatCode.cs: swapCount = MAX_SWAPS. |

## Try it
- Watch the platforms, pause/resume them, change their speed and restart their phases.
- Move right until the blue player overlaps the gold pickup.
- Press E or Collect to add one swap. Leaving contact disables collection.
- Use a swap, then use C or the refill button to restore four.
- Reset restores the resource test.

## Adaptation choices
The resource test starts at two swaps, rather than the original four, to make replenishment immediately visible. The Use one swap button isolates the resource counter; the original player/shadow switching, animations and warping are not reproduced. Platform paths are drawn at display scale. Simple rectangles replace game assets. The pickup remains available for repeated presses, consistent with the supplied collection logic.

## Validation
Run `node mechanics.test.mjs` for checks of travel timing, endpoint reversal, phase, zero-speed/zero-distance handling, contact-gated collection and resource limits. These checks passed before publication.

Live browser checks also passed: platform pause/resume, speed adjustment and restart; collection blocked outside contact; one swap added per press while touching; cap enforced at four; resource consumption; C-key refill; and Reset restoring two swaps and the initial player position. Original game integration and C# runtime tests are not claimed by these browser/JavaScript checks.

## Publish
In repository Settings → Pages, choose Deploy from a branch, main, /(root), then Save. index.html loads the JavaScript modules directly; no visitor installation or external graphics library is required.
