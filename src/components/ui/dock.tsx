'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  isValidElement,
} from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 140;
const DEFAULT_PANEL_HEIGHT = 72; 

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function useDock() {
  const context = useContext(DockContext);
  if (!context) throw new Error('useDock must be used within an DockProvider');
  return context;
}

export function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 15 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className='mx-2 flex h-[120px] items-end justify-center overflow-visible mb-4'>
      <motion.div
        onMouseMove={({ pageX }) => mouseX.set(pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{ height: panelHeight }}
        className={cn(
          'mx-auto flex w-fit gap-4 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 border border-white/20 dark:border-neutral-800 shadow-2xl items-end pb-2',
          className
        )}
        role='toolbar'
      >
        <DockContext.Provider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockContext.Provider>
      </motion.div>
    </div>
  );
}

export function DockItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(mouseDistance, [-distance, 0, distance], [52, magnification, 52]);
  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }} // Mantém proporção 1:1 para o ícone crescer redondo/quadrado
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      className={cn('relative inline-flex items-center justify-center transition-all', className)}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, { 
            width, 
            isHovered 
          });
        }
        return child;
      })}
    </motion.div>
  );
}

export function DockLabel({ children, className, ...props }: any) {
  const { isHovered, ...rest } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest: number) => {
        setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0, x: '-50%', scale: 0.8 }}
          animate={{ opacity: 1, y: -45, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 0, x: '-50%', scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            'absolute left-1/2 w-fit whitespace-pre rounded-lg border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-neutral-800/90 dark:text-zinc-100', 
            className
          )}
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({ children, className, ...props }: any) {
  const { width, isHovered, ...rest } = props;
  
  // O ícone ocupa uma porcentagem do DockItem que está crescendo
  const iconSize = useTransform(width || useMotionValue(52), (val: number) => val * 0.6);

  return (
    <motion.div
      style={{ width: iconSize, height: iconSize }}
      className={cn('flex items-center justify-center', className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}