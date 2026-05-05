import React, { useEffect, useState, useCallback } from "react";

interface GoogleButtonProps {
  onSuccess: (response: any) => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onSuccess }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Memoize the onSuccess callback to prevent unnecessary re-renders
  const memoizedOnSuccess = useCallback(onSuccess, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "599251054902-9s286dlgrjg24fkkler7vdk873q9hgac.apps.googleusercontent.com",
        callback: memoizedOnSuccess,
      });

      // Clear existing button if it exists
      const existingButton = document.getElementById("googleBtn");
      if (existingButton) {
        existingButton.innerHTML = '';
      }

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          width: isMobile ? 250 : 300,
        }
      );
    }
  }, [memoizedOnSuccess, isMobile]);

  return <div id="googleBtn"></div>;
};

export default GoogleButton;
