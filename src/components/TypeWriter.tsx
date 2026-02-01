import React, {useMemo} from 'react';
import {useCurrentFrame, random} from 'remotion';
import {
	AnimatedValue,
	buildMotionStyles,
	interpolateKeyframes,
	useMotionTiming,
	VisualProps,
	TransformProps,
	TimingProps,
} from '../utils/motion';
import {anyElement} from '../utils/random';

export interface TypeWriterTransitionProps
	extends TransformProps,
		VisualProps,
		TimingProps {}

export interface TypeWriterProps {
	/**
	 * Text content to type. Can be a single string or an array of strings to type in sequence.
	 */
	text: string | string[];

	/**
	 * Duration in frames for typing a single character.
	 * Can be an array to vary speed over the course of the string.
	 * @default 3
	 */
	typeSpeed?: AnimatedValue<number>;

	/**
	 * Duration in frames for deleting a single character.
	 * @default 2
	 */
	deleteSpeed?: AnimatedValue<number>;

	/**
	 * Frames to wait after finishing typing a string.
	 * @default 30
	 */
	pauseAfterType?: number;

	/**
	 * Frames to wait after deleting a string before typing the next one.
	 * @default 15
	 */
	pauseAfterDelete?: number;

	/**
	 * Probability (0-1) of making a typo for each character.
	 * @default 0
	 */
	errorRate?: number;

	/**
	 * Frames to wait before correcting a typo.
	 * @default 5
	 */
	errorCorrectDelay?: number;

	/**
	 * Random seed for error generation.
	 * @default "typewriter"
	 */
	seed?: number | string;

	/**
	 * Cursor to display. Pass boolean to enable/disable default cursor "|", or pass a ReactNode.
	 * @default true
	 */
	cursor?: boolean | React.ReactNode;

	/**
	 * Blink speed in frames (full cycle).
	 * @default 30
	 */
	blinkSpeed?: number;

	/**
	 * Whether to keep blinking the cursor after typing is complete.
	 * @default true
	 */
	showCursorAfterComplete?: boolean;

	/**
	 * CSS styles for the container.
	 */
	style?: React.CSSProperties;

	/**
	 * CSS class name.
	 */
	className?: string;

	/**
	 * Intro transition configuration.
	 */
	transition?: TypeWriterTransitionProps;

	/**
	 * Delay starting the animation in frames.
	 * @default 0
	 */
	delay?: number;

	/**
	 * Whether to loop the sequence of texts indefinitely.
	 * @default false
	 */
	loop?: boolean;

	/**
	 * Whether to delete the text before typing the next string in the array.
	 * If false, the next string will be appended to the current text.
	 * @default true
	 */
	deleteBeforeNext?: boolean;
}

interface TimelineEvent {
	frame: number;
	text: string;
}

const DEFAULT_TYPE_SPEED = 3;
const DEFAULT_DELETE_SPEED = 2;
const DEFAULT_PAUSE_TYPE = 30;
const DEFAULT_PAUSE_DELETE = 15;
// Common chars for typos
const KEYBOARD_CHARS =
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? ';

export const TypeWriter: React.FC<TypeWriterProps> = ({
	text,
	typeSpeed = DEFAULT_TYPE_SPEED,
	deleteSpeed = DEFAULT_DELETE_SPEED,
	pauseAfterType = DEFAULT_PAUSE_TYPE,
	pauseAfterDelete = DEFAULT_PAUSE_DELETE,
	errorRate = 0,
	errorCorrectDelay = 5,
	seed = 'typewriter',
	cursor = true,
	blinkSpeed = 30,
	showCursorAfterComplete = true,
	style,
	className,
	transition,
	delay = 0,
	loop = false,
	deleteBeforeNext = true,
}) => {
	const frame = useCurrentFrame();

	// Transition logic
	const transitionConfig = transition
		? {
				frames: transition.frames,
				duration: transition.duration,
				delay: (transition.delay ?? 0) + delay,
				easing: transition.easing,
		  }
		: {duration: 0};

	// Use hook unconditionally
	const transitionProgress = useMotionTiming(transitionConfig);
	
	const containerStyle = transition
		? buildMotionStyles({
				progress: transitionProgress,
				transforms: transition,
				styles: transition,
				easing: undefined, // handled in timing
				baseStyle: style,
				duration: transition.duration,
		  })
		: style;

	const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

	const {events, totalDuration} = useMemo(() => {
		const timelineEvents: TimelineEvent[] = [{frame: 0, text: ''}];
		let floatFrame = 0;
		let currentText = '';

		const pushState = () => {
			timelineEvents.push({frame: Math.round(floatFrame), text: currentText});
		};

		const processString = (str: string, strIndex: number) => {
			const len = str.length;

			// Typing
			for (let i = 0; i < len; i++) {
				const char = str[i];
				const progress = i / Math.max(1, len);

				// Error simulation
				const charSeed = `${seed}-${strIndex}-${i}`;
				const isError = random(charSeed) < errorRate;

				if (isError) {
					const wrongChar = anyElement(
						charSeed + '-wrong',
						KEYBOARD_CHARS.split('')
					);

					// Type wrong char
					const tSpeed = interpolateKeyframes(
						typeSpeed,
						progress,
						undefined,
						len
					);
					floatFrame += tSpeed;
					currentText += wrongChar;
					pushState();

					// Wait before noticing
					floatFrame += errorCorrectDelay;
					pushState();

					// Backspace
					const dSpeed = interpolateKeyframes(
						deleteSpeed,
						(i + 1) / Math.max(1, len),
						undefined,
						len
					);
					floatFrame += dSpeed;
					currentText = currentText.slice(0, -1);
					pushState();
				}

				// Type correct char
				const tSpeed = interpolateKeyframes(typeSpeed, progress, undefined, len);
				floatFrame += tSpeed;
				currentText += char;
				pushState();
			}

			// Pause after type
			floatFrame += pauseAfterType;
			pushState();

			// Deleting (if not last or loop is enabled)
			const isLast = strIndex === texts.length - 1;
			const shouldDelete =
				deleteBeforeNext && (!isLast || (loop && texts.length > 1) || (loop && texts.length === 1)); 
				// Logic: 
				// If not last, delete if deleteBeforeNext is true.
				// If last, delete ONLY if looping.
				// Wait, if deleteBeforeNext is false, we NEVER delete between items.
				
			// Let's refine the logic to match intent:
			// We want to clear between items usually.
			// If deleteBeforeNext is false, we append.
			// But if we loop, at the end of the list, do we clear everything to start over?
			// Usually yes, otherwise it grows infinitely.
			// If deleteBeforeNext is false, we probably shouldn't loop or if we loop, we need to clear at the END.
			
			// Let's stick to simple logic:
			// 1. Between items behavior: controlled by deleteBeforeNext.
			// 2. End of list behavior: controlled by loop. If loop, we MUST clear to restart? Or maybe not?
			// The original implementation was: const shouldDelete = !isLast || loop;
			
			// New Logic for deletion phase between items:
			if (deleteBeforeNext) {
				const isLast = strIndex === texts.length - 1;
				const shouldDeleteThis = !isLast || loop; 
				
				if (shouldDeleteThis) {
					const currentLen = currentText.length;
					for (let i = currentLen - 1; i >= 0; i--) {
						const progress = 1 - i / Math.max(1, currentLen);
						const dSpeed = interpolateKeyframes(
							deleteSpeed,
							progress,
							undefined,
							currentLen
						);
						floatFrame += dSpeed;
						currentText = currentText.slice(0, -1);
						pushState();
					}
					floatFrame += pauseAfterDelete;
					pushState();
				}
			} else {
			    // If we append (deleteBeforeNext is false), we might need to add a newline?
			    // The user should provide newlines in the strings if they want them.
			    
			    // What if we loop and deleteBeforeNext is false?
			    // e.g. "A" -> "AB" -> "ABC" ... loop -> "A"?
			    // To support that, we'd need a "clearAll" logic at the end of sequence.
			    // For now, let's assume if deleteBeforeNext is false, we just don't delete.
			    // If loop is true, we might need to clear at the very end of the sequence.
			    
			    const isLast = strIndex === texts.length - 1;
			    if (isLast && loop) {
			         // Clear everything rapidly or normally?
			         // Let's use deleteSpeed.
			         const currentLen = currentText.length;
						for (let i = currentLen - 1; i >= 0; i--) {
						const progress = 1 - i / Math.max(1, currentLen);
						const dSpeed = interpolateKeyframes(
							deleteSpeed,
							progress,
							undefined,
							currentLen
						);
						floatFrame += dSpeed;
						currentText = currentText.slice(0, -1);
						pushState();
					}
					floatFrame += pauseAfterDelete;
					pushState();
			    }
			}
		};

		texts.forEach((str, index) => {
			processString(str, index);
		});

		return {events: timelineEvents, totalDuration: floatFrame};
	}, [
		texts,
		typeSpeed,
		deleteSpeed,
		pauseAfterType,
		pauseAfterDelete,
		errorRate,
		errorCorrectDelay,
		seed,
		loop,
		deleteBeforeNext,
	]);

	const effectiveStartFrame = (transition?.delay ?? 0) + delay;
	let relativeFrame = frame - effectiveStartFrame;

	if (loop && totalDuration > 0) {
		relativeFrame = relativeFrame % totalDuration;
		if (relativeFrame < 0) relativeFrame += totalDuration;
	}

	let visibleText = '';
	if (relativeFrame >= 0) {
		// Find the last event that happened before or at relativeFrame
		// Optimization: Binary search could be better for very long texts, 
        // but linear scan or reverse find is okay for typical usage.
        // We'll use a simple loop since we want to find element where e.frame <= relativeFrame
        // and next.frame > relativeFrame
        
        let activeIndex = 0;
        // Optimization: start from end if time is large? No, usually small.
        // Let's implement lower_bound logic effectively.
        // Since events are sorted by frame...
        
        // Simple linear scan for now.
        for(let i=0; i < events.length; i++) {
            if (events[i].frame <= relativeFrame) {
                activeIndex = i;
            } else {
                break;
            }
        }
        visibleText = events[activeIndex].text;
	}

	const isComplete = !loop && frame - effectiveStartFrame > totalDuration;
	const shouldShowCursor =
		cursor && (!isComplete || showCursorAfterComplete) && relativeFrame >= 0;

	let renderCursor = null;
	if (shouldShowCursor) {
		const isBlinking = relativeFrame % blinkSpeed < blinkSpeed / 2;
		const cursorContent = typeof cursor === 'boolean' ? '|' : cursor;
		
		const cursorStyle: React.CSSProperties = {
            opacity: isBlinking ? 1 : 0, 
            display: 'inline-block' // Ensures it takes space?
        };

        // If user provided a node, we might wrap it or strict toggle.
        // To prevent layout shift, we should keep it in DOM but invisible.
		renderCursor = (
			<span style={cursorStyle}>
				{cursorContent}
			</span>
		);
	}

	return (
		<span style={containerStyle} className={className}>
			{visibleText.split('\n').map((line, i, arr) => (
				<React.Fragment key={i}>
					{line}
					{i < arr.length - 1 && <br />}
				</React.Fragment>
			))}
			{renderCursor}
		</span>
	);
};
