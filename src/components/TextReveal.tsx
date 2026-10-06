import React from 'react';
import { motion, useInView } from 'motion/react';

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  wordClassName = '',
  tag = 'h2',
  staggerDelay = 0.055,
  initialDelay = 0.08,
  once = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px 0px' });
  const words = text.trim().split(/\s+/);

  const Tag = tag as React.ElementType;

  return (
    <div ref={ref} dir="rtl" className="overflow-visible">
      <Tag className={className}>
        <motion.span
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: staggerDelay, delayChildren: initialDelay } },
          }}
          className="inline"
        >
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 34, filter: 'blur(7px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className={`inline-block will-change-transform ${wordClassName}`}
              style={{ marginInlineEnd: '0.28em' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    </div>
  );
};
