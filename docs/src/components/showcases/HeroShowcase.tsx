import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { TextTransition, BackgroundTransition } from 'remotion-bits';
import { Center } from './Center';

export const HeroShowcase: React.FC = () => {
    const { width } = useVideoConfig();

    return (
        <AbsoluteFill>
            <BackgroundTransition
                gradient={[
                    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    "linear-gradient(30deg, #1e293b 0%, #334155 100%)",
                    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                ]}
                duration={300}
            >
                <Center>
                    <TextTransition
                        transition={{
                            opacity: [0, 1, 0],
                            y: [40, 0, -40],
                            scale: [0.9, 1, 1],
                            frames: [0, 25, 30],
                            cycle: {
                                texts: [
                                    "Remotion",
                                    "React",
                                    "Components",
                                    "Video",
                                ],
                                itemDuration: 30
                            },
                            easing: 'easeInOut'
                        }}
                        style={{
                            fontSize: width * 0.09,
                            fontWeight: 800,
                            color: 'white',
                            fontFamily: 'Geist Sans, sans-serif',
                            textAlign: 'center',
                            letterSpacing: '-0.02em',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            padding: '0 20px',
                            width: '100%',
                        }}
                    >
                    </TextTransition>
                </Center>
            </BackgroundTransition>
        </AbsoluteFill>
    );
};
