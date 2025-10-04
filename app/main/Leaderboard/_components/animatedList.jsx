import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion'; // ✅ use 'framer-motion' instead of 'motion/react'

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  item = [
    { name: "Sarah Chen", points: 450, issues: 42 },
    { name: "Michael Rodriguez", points: 380, issues: 35 },
    { name: "Priya Patel", points: 320, issues: 28 },
    { name: "James Kim", points: 290, issues: 25 },
    { name: "Aisha Johnson", points: 275, issues: 24 },
    { name: "David Wilson", points: 260, issues: 23 },
    { name: "Emma Davis", points: 240, issues: 22 },
    { name: "Carlos Mendez", points: 220, issues: 20 },
    { name: "Olivia Thompson", points: 210, issues: 19 },
    { name: "Tyrone Williams", points: 200, issues: 18 }
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  // Smooth gradient visibility control
  const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 60, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 60, 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, item.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < item.length) {
        e.preventDefault();
        onItemSelect?.(item[selectedIndex], selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, selectedIndex, onItemSelect, enableArrowNavigation]);

  // Auto scroll to selected item
  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 60;
      const { scrollTop, clientHeight } = container;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;

      if (itemTop < scrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > scrollTop + clientHeight - extraMargin) {
        container.scrollTo({ top: itemBottom - clientHeight + extraMargin, behavior: 'smooth' });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-full max-w-[1400px] mx-auto ${className}`}>
      <div
        ref={listRef}
        onScroll={handleScroll}
        className={`max-h-[800px] overflow-y-auto rounded-2xl p-4 bg-[#0b0b0f]/60 border border-[#1f1f25] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300
          ${displayScrollbar
            ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-blue-500/40 [&::-webkit-scrollbar-thumb]:rounded-[4px]'
            : 'scrollbar-hide'
        }`}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: '#3b82f6 #060010'
        }}
      >
        {item.map((user, index) => (
          <AnimatedItem
            key={index}
            delay={0.1 + index * 0.05}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              onItemSelect?.(user, index);
            }}
          >
            <div
              className={`p-5 rounded-xl flex items-center justify-between border transition-all duration-300 
                ${selectedIndex === index
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-700/10 border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.25)] scale-[1.02]'
                  : 'bg-[#101014]/60 border-[#1c1c22]'
                } ${itemClassName}`}
            >
              <div className="flex items-center space-x-6">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full 
                    ${selectedIndex === index ? 'bg-blue-500 text-white' : 'bg-[#1f1f25] text-gray-300'}
                    font-semibold text-lg transition-all duration-300`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{user.name}</p>
                  <p className="text-gray-400 text-sm">
                    {user.issues} <span className="text-blue-400">issues solved</span>
                  </p>
                </div>
              </div>

              <div className="bg-[#1f1f25]/70 px-4 py-2 rounded-full border border-[#2a2a35]">
                <span className="text-blue-400 text-base font-semibold">{user.points} pts</span>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>

      {/* Scroll gradients */}
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
