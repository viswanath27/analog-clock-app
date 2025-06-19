import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  // Calculate rotation angles (0 degrees is 12 o'clock, angles increase clockwise)
  const secondAngle = (seconds * 6); // 6 degrees per second
  const minuteAngle = (minutes * 6 + seconds * 0.1); // 6 degrees per minute + smooth transition
  const hourAngle = (hours * 30 + minutes * 0.5); // 30 degrees per hour + smooth transition

  // Calculate responsive size - smaller to fit everything on screen
  const clockSize = Math.min(windowSize.width * 0.45, windowSize.height * 0.8);
  const frameSize = clockSize * 1.2; // Reduced frame size
  const frameOffset = (frameSize - clockSize) / 2;

  return (
    <div className="flex items-center min-h-screen bg-gray-100 relative overflow-hidden" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
      {/* Fullscreen Button */}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-30 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-4 py-2 rounded-lg shadow-lg border transition-all duration-200 hover:shadow-xl"
          style={{ borderColor: '#8B4513' }}
        >
          <div className="flex items-center gap-2">
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <span className="text-sm font-medium">Fullscreen</span>
          </div>
        </button>
      )}
      
      <div className="flex items-center gap-8 w-full max-w-none">
        {/* Clock Container */}
        <div className="relative flex-shrink-0">
        {/* Decorative sunburst frame */}
        <div 
          className="absolute" 
          style={{ 
            width: `${frameSize}px`, 
            height: `${frameSize}px`,
            top: `-${frameOffset}px`, 
            left: `-${frameOffset}px` 
          }}
        >
          <svg 
            width={frameSize} 
            height={frameSize} 
            viewBox={`0 0 ${frameSize} ${frameSize}`} 
            className="absolute inset-0"
          >
            {/* Create 18 leaf/ray patterns */}
            {[...Array(18)].map((_, i) => {
              const angle = i * 20; // 20 degrees apart
              const center = frameSize / 2;
              const leafScale = frameSize / 540; // Scale factor based on original size
              const leafTop = center - frameSize * 0.44;
              const leafTip = center - frameSize * 0.49;
              const leafWidth = 30 * leafScale;
              const leafHeight = 50 * leafScale;
              
              return (
                <g key={i} transform={`rotate(${angle} ${center} ${center})`}>
                  {/* Leaf/Ray shape */}
                  <path
                    d={`M ${center} ${leafTop} L ${center - leafWidth/2} ${leafTip} Q ${center} ${leafTip - 10 * leafScale} ${center + leafWidth/2} ${leafTip} L ${center} ${leafTop}`}
                    fill="#8B4513"
                    stroke="#654321"
                    strokeWidth={0.5 * leafScale}
                  />
                  <rect
                    x={center - leafWidth/2}
                    y={leafTop}
                    width={leafWidth}
                    height={leafHeight}
                    fill="#8B4513"
                    stroke="#654321"
                    strokeWidth={0.5 * leafScale}
                    rx={2 * leafScale}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Clock face with wooden border */}
        <div 
          className="relative rounded-full" 
          style={{ 
            width: `${clockSize}px`, 
            height: `${clockSize}px`,
            background: `
              radial-gradient(ellipse at 30% 30%, #8B4513 0%, #654321 40%, #3E2723 100%),
              linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #654321 50%, #5D4E37 75%, #3E2723 100%)
            `,
            padding: `${clockSize * 0.03125}px`,
            boxShadow: `
              0 ${clockSize * 0.052}px ${clockSize * 0.104}px rgba(0,0,0,0.3),
              inset 0 ${clockSize * 0.013}px ${clockSize * 0.026}px rgba(139,69,19,0.8),
              inset 0 -${clockSize * 0.013}px ${clockSize * 0.026}px rgba(62,39,35,0.8)
            `,
            border: `${clockSize * 0.0052}px solid #3E2723`
          }}
        >
          {/* Inner wooden rim */}
          <div 
            className="relative w-full h-full rounded-full" 
            style={{ 
              background: `
                radial-gradient(ellipse at 40% 30%, #CD853F 0%, #A0522D 30%, #8B4513 60%, #654321 100%),
                linear-gradient(145deg, #D2691E 0%, #CD853F 20%, #A0522D 40%, #8B4513 70%, #654321 100%)
              `,
              padding: `${clockSize * 0.0208}px`,
              boxShadow: `
                inset 0 ${clockSize * 0.0104}px ${clockSize * 0.0208}px rgba(210,105,30,0.6),
                inset 0 -${clockSize * 0.0104}px ${clockSize * 0.0208}px rgba(101,67,33,0.8),
                0 0 ${clockSize * 0.0104}px rgba(0,0,0,0.3)
              `,
              border: `${clockSize * 0.0026}px solid #5D4E37`
            }}
          >
            {/* White dial */}
            <div 
              className="relative w-full h-full rounded-full" 
              style={{
                background: `
                  radial-gradient(ellipse at 35% 25%, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%)
                `,
                boxShadow: `
                  inset 0 ${clockSize * 0.0156}px ${clockSize * 0.0312}px rgba(0,0,0,0.1),
                  inset 0 -${clockSize * 0.0078}px ${clockSize * 0.0156}px rgba(0,0,0,0.05),
                  0 ${clockSize * 0.0052}px ${clockSize * 0.0104}px rgba(0,0,0,0.1)
                `
              }}
            >
              {/* Center dot */}
              <div 
                className="absolute top-1/2 left-1/2 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{
                  width: `${clockSize * 0.03125}px`,
                  height: `${clockSize * 0.03125}px`,
                  background: `
                    radial-gradient(circle at 30% 30%, #4a4a4a 0%, #333333 50%, #1a1a1a 100%)
                  `,
                  boxShadow: `
                    0 ${clockSize * 0.0052}px ${clockSize * 0.0104}px rgba(0,0,0,0.5),
                    inset 0 ${clockSize * 0.0026}px ${clockSize * 0.0052}px rgba(255,255,255,0.3)
                  `
                }}
              ></div>
              
              {/* Brand name */}
              <div 
                className="absolute top-[25%] left-1/2 transform -translate-x-1/2 text-gray-700 font-serif tracking-widest"
                style={{ fontSize: `${clockSize * 0.0365}px` }} // Proportional to original 14px
              >
                OREVA
              </div>
              
              {/* Hour numbers */}
              {[...Array(12)].map((_, i) => {
                const number = i === 0 ? 12 : i;
                const angle = (i * 30) - 90; // Start from 12 o'clock position
                const radian = (angle * Math.PI) / 180;
                const x = 50 + 36 * Math.cos(radian);
                const y = 50 + 36 * Math.sin(radian);
                
                return (
                  <div
                    key={number}
                    className="absolute text-gray-800 font-serif"
                    style={{
                      top: `${y}%`,
                      left: `${x}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${clockSize * 0.0729}px`, // Proportional to original 28px
                      fontWeight: '500'
                    }}
                  >
                    {number}
                  </div>
                );
              })}
              
              {/* Minute marks - 4 marks between each number */}
              {[...Array(60)].map((_, i) => {
                if (i % 5 === 0) return null; // Skip hour positions
                
                const angle = (i * 6); // 6 degrees per mark
                const radian = ((angle - 90) * Math.PI) / 180;
                const innerRadius = 43;
                
                const x1 = 50 + innerRadius * Math.cos(radian);
                const y1 = 50 + innerRadius * Math.sin(radian);
                
                return (
                  <div
                    key={i}
                    className="absolute bg-gray-700"
                    style={{
                      width: `${clockSize * 0.0026}px`, // Proportional to original 1px
                      height: `${clockSize * 0.0156}px`, // Proportional to original 6px
                      top: `${y1}%`,
                      left: `${x1}%`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      transformOrigin: 'center'
                    }}
                  ></div>
                );
              })}
              
              {/* Hour marks */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30); // 30 degrees per hour
                const radian = ((angle - 90) * Math.PI) / 180;
                const innerRadius = 41;
                
                const x1 = 50 + innerRadius * Math.cos(radian);
                const y1 = 50 + innerRadius * Math.sin(radian);
                
                return (
                  <div
                    key={i}
                    className="absolute bg-gray-800"
                    style={{
                      width: `${clockSize * 0.0052}px`, // Proportional to original 2px
                      height: `${clockSize * 0.026}px`, // Proportional to original 10px
                      top: `${y1}%`,
                      left: `${x1}%`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      transformOrigin: 'center'
                    }}
                  ></div>
                );
              })}
              
              {/* Hour hand - wider and shorter */}
              <div
                className="absolute rounded-full transition-transform duration-500"
                style={{
                  width: `${clockSize * 0.0208}px`,
                  height: `${clockSize * 0.2865}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -85%) rotate(${hourAngle}deg)`,
                  transformOrigin: 'center 85%',
                  background: `
                    linear-gradient(90deg, #2c2c2c 0%, #4a4a4a 50%, #1a1a1a 100%)
                  `,
                  boxShadow: `
                    0 ${clockSize * 0.0078}px ${clockSize * 0.0156}px rgba(0,0,0,0.6),
                    inset 0 ${clockSize * 0.0026}px ${clockSize * 0.0052}px rgba(255,255,255,0.2)
                  `
                }}
              ></div>
              
              {/* Minute hand - thinner and longer */}
              <div
                className="absolute rounded-full transition-transform duration-500"
                style={{
                  width: `${clockSize * 0.013}px`,
                  height: `${clockSize * 0.391}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -85%) rotate(${minuteAngle}deg)`,
                  transformOrigin: 'center 85%',
                  background: `
                    linear-gradient(90deg, #2c2c2c 0%, #4a4a4a 50%, #1a1a1a 100%)
                  `,
                  boxShadow: `
                    0 ${clockSize * 0.0078}px ${clockSize * 0.0156}px rgba(0,0,0,0.6),
                    inset 0 ${clockSize * 0.0026}px ${clockSize * 0.0052}px rgba(255,255,255,0.2)
                  `
                }}
              ></div>
              
              {/* Second hand - very thin */}
              <div
                className="absolute rounded-full transition-transform duration-100"
                style={{
                  width: `${clockSize * 0.0052}px`,
                  height: `${clockSize * 0.417}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -85%) rotate(${secondAngle}deg)`,
                  transformOrigin: 'center 85%',
                  background: `
                    linear-gradient(90deg, #8B0000 0%, #DC143C 50%, #B22222 100%)
                  `,
                  boxShadow: `
                    0 ${clockSize * 0.0052}px ${clockSize * 0.0104}px rgba(0,0,0,0.4),
                    inset 0 ${clockSize * 0.0013}px ${clockSize * 0.0026}px rgba(255,255,255,0.3)
                  `
                }}
              ></div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Digital time display - moved to right side */}
        <div className="flex-1 flex items-center justify-center ml-4">
          <div 
            className="text-gray-700 font-mono bg-white rounded-lg shadow-lg border-2 text-center" 
            style={{ 
              borderColor: '#8B4513', 
              padding: `${clockSize * 0.03}px ${clockSize * 0.06}px`, // Reduced padding
              fontSize: `${clockSize * 0.065}px`, // Reduced font size
              minWidth: `${clockSize * 0.55}px`, // Increased width to fit AM/PM
              maxWidth: `${clockSize * 0.65}px` // Increased max width
            }}
          >
            <div className="text-center whitespace-nowrap">
              {time.toLocaleTimeString()}
            </div>
            <div 
              className="text-center mt-1 whitespace-nowrap"
              style={{ fontSize: `${clockSize * 0.043}px` }} // Reduced date font
            >
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;