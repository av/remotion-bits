### v0.1.9

- Feature: Added CodeBlock component for syntax highlighting and animations
- Feature: Added TypeWriter component for typewriter text effects
- Feature: Added MatrixRain component for Matrix-style falling character effects
- Feature: Added GlitchCycle and GlitchIn components for glitch transition effects
- Feature: Added ShapeIcon component for animated shape icons
- Feature: Enhanced AnimatedCounter with step timing support
- Feature: Added hold functionality to interpolation utilities
- Feature: Added scaleZ support to Transform3D and Step components
- Feature: Enhanced Transform3D with ID management, random operations, and Vector3 support for translate method
- Feature: Enhanced StepResponsive with centered prop, style props, cumulative step property resolution, and transform key support
- Feature: Enhanced Scene3D components with duration support and centered transformations
- Feature: Enhanced AnimatedText with dynamic duration support
- Improvement: Enhanced BitPlayground to handle bit props and improve error handling
- Improvement: Updated dependencies and improved documentation for Bits
- Improvement: Added gradient backgrounds and enhanced FeatureShowcase component
- Docs: Completed showcase documentation
- Docs: Added transitions scene documentation
- Fix: Removed unused doFrame function causing TypeScript error

### v0.1.8

- Feature: Added duration prop to Step component for customizable step duration
- Feature: Enhanced interpolation functions to support Transform3D and Matrix4
- Feature: Added 3D interpolation utilities and transform handling
- Improvement: Updated easing function to use 'easeInOut' for smoother transitions
- Docs: Added Transform3D link to Bits sidebar in documentation

### v0.1.7

- Fix: Packaged version fix and added extensions script for better build tooling
- Improvement: Cleaned up 3D Elements example by removing unnecessary red triangle

### v0.1.6

- Feature: Added `StepResponsive` component for responsive 3D element transformations based on active step
- Feature: Added `StepTimingContext` and `useStepTiming` hook for accessing Step timing information
- Feature: Enhanced `useMotionTiming` to auto-align with Step boundaries when used inside a Step
- Improvement: Made `transition` prop optional in `AnimatedText` and `StaggeredMotion` components
- Improvement: Enhanced `AnimatedText` split prop with predefined options ("none", "word", "character", "line")
- Docs: Updated 3D Elements example with better formatting and showcase of new StepResponsive features
- Fix: StepResponsive animation logic to match Scene3D camera transition, preventing instant jumps
- Fix: StepResponsive now correctly respects `transition.duration` and `transition.delay` overrides

### v0.1.5

- Feature: Added all component bits to the registry for easier installation
- Docs: Enhanced skill documentation with better examples and patterns

### v0.1.4

- Improvement: Cleaned up README documentation
- Docs: Added Scene3D examples reference to skill file
- Fix: Linter fixes and code quality improvements

### v0.1.3

- Improvement: Refined Scene3D mechanics and usage patterns
- Feature: Added skill maintenance to agent instructions
- Improvement: Landing page cleanups with squircle design elements
- Docs: Updated skill info related to 3D scenes
- Docs: CLAUDE.md now references AGENTS.md for better organization

### v0.1.2

- Feature: Added scrolling columns bit component
- Feature: Added better bento grid layout for docs
- Feature: Improved BitPlayground with action styles and custom scrollbars
- Feature: Enhanced catalog with proper tags and theme improvements
- Fix: Fixed radial gradient transitions
- Improvement: Normalized bit names for consistency
- Improvement: Playground and README fixes and tweaks
- Docs: Added jsrepo config and reference for existing components
