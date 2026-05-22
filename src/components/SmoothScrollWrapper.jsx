import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LocomotiveScroll from 'locomotive-scroll';

export default function SmoothScrollWrapper({ children }) {
  const scrollRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
  const locoScroll = new LocomotiveScroll({
    lenisOptions: {
      lerp: 0.1,
    },
  });

  return () => {
    if (scrollRef.current) {
      scrollRef.current.destroy();
    }
  };
}, [pathname]);
  return <main data-scroll-container>{children}</main>;
}