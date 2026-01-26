import React, { useState } from 'react';
import { HeroShowcase } from './showcases/HeroShowcase';
import { ParticlesSnowShowcase } from './showcases/ParticlesShowcase';
import { TextTransitionShowcase } from './showcases/TextTransitionShowcase';
import { ShowcasePlayer } from './ShowcasePlayer';

const EXAMPLES = [
    {
        id: 'transitions',
        label: 'Transitions',
        filename: 'Composition.tsx',
        component: HeroShowcase,
        duration: 300,
        height: 400,
        width: 250,
        code: (
            <>
                <span className="code-syntax-keyword">import</span> &#123; <span className="code-syntax-func">BackgroundTransition</span>, <span className="code-syntax-func">TextTransition</span> &#125; <span className="code-syntax-keyword">from</span> <span className="code-syntax-string">'remotion-bits'</span>;
                {'\n'}
                <span className="code-syntax-keyword">import</span> &#123; <span className="code-syntax-func">Center</span> &#125; <span className="code-syntax-keyword">from</span> <span className="code-syntax-string">'./Center'</span>;
                {'\n\n'}
                <span className="code-syntax-keyword">export const</span> <span className="code-syntax-func">MyVideo</span> = () =&gt; &#123;
                {'\n'}
                {'  '}<span className="code-syntax-keyword">return</span> (
                {'\n'}
                {'    '}&lt;<span className="code-syntax-tag">BackgroundTransition</span>
                {'\n'}
                {'      '}<span className="code-syntax-attr">gradient</span>=&#123;[<span className="code-syntax-string">"#0f172a"</span>, <span className="code-syntax-string">"#1e293b"</span>]&#125;
                {'\n'}
                {'      '}<span className="code-syntax-attr">duration</span>=&#123;<span className="code-syntax-attr">300</span>&#125;
                {'\n'}
                {'    '}&gt;
                {'\n'}
                {'      '}&lt;<span className="code-syntax-tag">Center</span>&gt;
                {'\n'}
                {'          '}&lt;<span className="code-syntax-tag">TextTransition</span>
                {'\n'}
                {'            '}<span className="code-syntax-attr">transition</span>=&#123;&#123;
                {'\n'}
                {'                '}<span className="code-syntax-attr">cycle</span>: &#123;
                {'\n'}
                {'                    '}<span className="code-syntax-attr">texts</span>: [
                {'\n'}
                {'                        '}<span className="code-syntax-string">"Production Ready"</span>,
                {'\n'}
                {'                        '}<span className="code-syntax-string">"Type Safe"</span>,
                {'\n'}
                {'                        '}<span className="code-syntax-string">"Remotion Bits"</span>
                {'\n'}
                {'                    '}]&#125;
                {'\n'}
                {'                '}&#125;
                {'\n'}
                {'            '}&#125;
                {'\n'}
                {'          '}/&gt;
                {'\n'}
                {'      '}&lt;/<span className="code-syntax-tag">Center</span>&gt;
                {'\n'}
                {'    '}&lt;/<span className="code-syntax-tag">BackgroundTransition</span>&gt;
                {'\n'}
                {'  '});
                {'\n'}
                &#125;;
            </>
        )
    },
    {
        id: 'particles',
        label: 'Particles',
        filename: 'Particles.tsx',
        component: ParticlesSnowShowcase,
        duration: 300,
        height: 450,
        width: 800,
        code: (
             <>
                 <span className="code-syntax-keyword">import</span> &#123; <span className="code-syntax-func">Particles</span>, <span className="code-syntax-func">Spawner</span>, <span className="code-syntax-func">Behavior</span> &#125; <span className="code-syntax-keyword">from</span> <span className="code-syntax-string">'remotion-bits'</span>;
                 {'\n'}
                 <span className="code-syntax-keyword">import</span> &#123; <span className="code-syntax-func">useVideoConfig</span> &#125; <span className="code-syntax-keyword">from</span> <span className="code-syntax-string">'remotion'</span>;
                 {'\n\n'}
                 <span className="code-syntax-keyword">export const</span> <span className="code-syntax-func">Snow</span> = () =&gt; &#123;
                 {'\n'}
                 {'  '}<span className="code-syntax-keyword">const</span> &#123; <span className="code-syntax-attr">width</span> &#125; = <span className="code-syntax-func">useVideoConfig</span>();
                 {'\n\n'}
                 {'  '}<span className="code-syntax-keyword">return</span> (
                 {'\n'}
                 {'    '}&lt;<span className="code-syntax-tag">AbsoluteFill</span> <span className="code-syntax-attr">className</span>=<span className="code-syntax-string">"bg-black"</span>&gt;
                 {'\n'}
                 {'      '}&lt;<span className="code-syntax-tag">Particles</span>&gt;
                 {'\n'}
                 {'        '}&lt;<span className="code-syntax-tag">Spawner</span>
                 {'\n'}
                 {'          '}<span className="code-syntax-attr">rate</span>=&#123;<span className="code-syntax-attr">1</span>&#125;
                 {'\n'}
                 {'          '}<span className="code-syntax-attr">area</span>=&#123;&#123; <span className="code-syntax-attr">width</span>, <span className="code-syntax-attr">height</span>: <span className="code-syntax-attr">0</span> &#125;&#125;
                 {'\n'}
                 {'        '}&gt;
                 {'\n'}
                 {'           '}&lt;<span className="code-syntax-tag">div</span> <span className="code-syntax-attr">className</span>=<span className="code-syntax-string">"w-3 h-3 bg-white rounded-full"</span> /&gt;
                 {'\n'}
                 {'        '}&lt;/<span className="code-syntax-tag">Spawner</span>&gt;
                 {'\n'}
                 {'        '}&lt;<span className="code-syntax-tag">Behavior</span> <span className="code-syntax-attr">gravity</span>=&#123;&#123; <span className="code-syntax-attr">y</span>: <span className="code-syntax-attr">0.1</span> &#125;&#125; /&gt;
                 {'\n'}
                 {'      '}&lt;/<span className="code-syntax-tag">Particles</span>&gt;
                 {'\n'}
                 {'      '}&lt;<span className="code-syntax-tag">Center</span>&gt;
                 {'\n'}
                 {'        '}&lt;<span className="code-syntax-tag">h1</span> <span className="code-syntax-attr">className</span>=<span className="code-syntax-string">"text-white"</span> <span className="code-syntax-attr">style</span>=&#123;&#123; <span className="code-syntax-attr">fontSize</span>: <span className="code-syntax-attr">width</span> * <span className="code-syntax-attr">0.16</span> &#125;&#125;&gt;Snow&lt;/<span className="code-syntax-tag">h1</span>&gt;
                 {'\n'}
                 {'      '}&lt;/<span className="code-syntax-tag">Center</span>&gt;
                 {'\n'}
                 {'    '}&lt;/<span className="code-syntax-tag">AbsoluteFill</span>&gt;
                 {'\n'}
                 {'  '})&#125;;
                 {'\n'}
                 &#125;;
             </>
        )
    },
    {
        id: 'text',
        label: 'TextReveal',
        filename: 'TextAnimations.tsx',
        component: TextTransitionShowcase,
        duration: 900,
        height: 450,
        width: 800,
        code: (
             <>
                <span className="code-syntax-keyword">import</span> &#123; <span className="code-syntax-func">TextTransition</span> &#125; <span className="code-syntax-keyword">from</span> <span className="code-syntax-string">'remotion-bits'</span>;
                {'\n'}
                <span className="code-syntax-keyword">import</span> &#123; <span className="code-syntax-func">Sequence</span> &#125; <span className="code-syntax-keyword">from</span> <span className="code-syntax-string">'remotion'</span>;
                {'\n\n'}
                <span className="code-syntax-keyword">export const</span> <span className="code-syntax-func">Showcase</span> = () =&gt; &#123;
                {'\n'}
                {'  '}<span className="code-syntax-keyword">return</span> (
                {'\n'}
                {'    '}&lt;&gt;
                {'\n'}
                {'      '}&lt;<span className="code-syntax-tag">Sequence</span> <span className="code-syntax-attr">durationInFrames</span>=&#123;<span className="code-syntax-attr">90</span>&#125;&gt;
                {'\n'}
                {'        '}&lt;<span className="code-syntax-tag">TextTransition</span>
                {'\n'}
                {'           '}<span className="code-syntax-attr">transition</span>=&#123;&#123; <span className="code-syntax-attr">opacity</span>: [<span className="code-syntax-attr">0</span>, <span className="code-syntax-attr">1</span>] &#125;&#125;
                {'\n'}
                {'        '}&gt;
                {'\n'}
                {'           '}Hello World
                {'\n'}
                {'        '}&lt;/<span className="code-syntax-tag">TextTransition</span>&gt;
                {'\n'}
                {'      '}&lt;/<span className="code-syntax-tag">Sequence</span>&gt;
                {'\n'}
                {'      '}&lt;<span className="code-syntax-tag">Sequence</span> <span className="code-syntax-attr">from</span>=&#123;<span className="code-syntax-attr">90</span>&#125;&gt;
                {'\n'}
                {'        '}&lt;<span className="code-syntax-tag">TextTransition</span>
                {'\n'}
                {'           '}<span className="code-syntax-attr">transition</span>=&#123;&#123;
                {'\n'}
                {'             '}<span className="code-syntax-attr">y</span>: [<span className="code-syntax-attr">100</span>, <span className="code-syntax-attr">0</span>],
                {'\n'}
                {'             '}<span className="code-syntax-attr">split</span>: <span className="code-syntax-string">'word'</span>
                {'\n'}
                {'           '}&#125;&#125;
                {'\n'}
                {'        '}&gt;
                {'\n'}
                {'           '}Word by Word
                {'\n'}
                {'        '}&lt;/<span className="code-syntax-tag">TextTransition</span>&gt;
                {'\n'}
                {'      '}&lt;/<span className="code-syntax-tag">Sequence</span>&gt;
                {'\n'}
                {'    '}&lt;/&gt;
                {'\n'}
                {'  '});
                {'\n'}
                &#125;;
             </>
        )
    }
];

export const HomeShowcase = () => {
    const [activeId, setActiveId] = useState('transitions');
    const activeExample = EXAMPLES.find(ex => ex.id === activeId) || EXAMPLES[0];

    return (
        <div className="relative rounded-xl border border-white/10 bg-surface-dark shadow-[0_0_50px_-10px_rgba(255,85,0,0.15)] overflow-hidden grid grid-cols-1 lg:grid-cols-5 ring-1 ring-white/5">
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0C0C0C] flex flex-col min-h-[450px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0A0A0A]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">code</span>
                        {activeExample.filename}
                    </div>
                    <div className="w-10"></div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden sm:flex w-40 flex-col border-r border-white/5 bg-[#0A0A0A]/50 py-2">
                        {EXAMPLES.map(ex => (
                            <button
                                key={ex.id}
                                onClick={() => setActiveId(ex.id)}
                                className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors border-l-2 flex items-center justify-between group
                                    ${activeId === ex.id
                                        ? 'text-white bg-white/5 border-primary'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-transparent'
                                    }`}
                            >
                                {ex.label}
                            </button>
                        ))}
                        <button className="w-full text-left px-4 py-2 text-xs font-mono text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors border-l-2 border-transparent">
                            Charts
                        </button>
                    </div>
                    <div className="p-6 font-mono text-sm md:text-base overflow-x-auto custom-scrollbar flex-1 text-left relative group">
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                        </div>
                        <pre><code className="language-jsx">{activeExample.code}</code></pre>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 bg-black relative flex items-center justify-center overflow-hidden group">
                <ShowcasePlayer
                    key={activeExample.id} // Force re-mount on change
                    component={activeExample.component}
                    duration={activeExample.duration}
                    controls={false}
                    autoPlay={true}
                    loop={true}
                    className="w-full h-full"
                    height={activeExample.height}
                    width={activeExample.width}
                    autoResize={true}
                />
            </div>
        </div>
    );
};
