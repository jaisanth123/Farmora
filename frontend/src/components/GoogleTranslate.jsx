// import React, { useEffect } from 'react';

// const GoogleTranslate = () => {
//   useEffect(() => {
//     // Add the Google Translate script to the document
//     const addScript = () => {
//       const script = document.createElement('script');
//       script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//       script.async = true;
//       document.body.appendChild(script);
//     };

//     // Define the callback function that Google Translate will call
//     if (!window.googleTranslateElementInit) {
//       window.googleTranslateElementInit = () => {
//         new window.google.translate.TranslateElement(
//           {
//             pageLanguage: 'en',
//             // You can set more options here if needed
//             // layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//             // autoDisplay: false,
//           },
//           'google_translate_element'
//         );
//       };
//     }

//     // Check if the script is already loaded
//     if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
//       addScript();
//     } else {
//       // If script is already loaded, just initialize the element
//       if (window.google && window.google.translate) {
//         window.googleTranslateElementInit();
//       }
//     }

//     // Cleanup function
//     return () => {
//       // Optional: Remove the script on component unmount if needed
//       // const script = document.querySelector('script[src*="translate.google.com/translate_a/element.js"]');
//       // if (script) document.body.removeChild(script);
      
//       // Remove the global callback to avoid duplicates if component remounts
//       // delete window.googleTranslateElementInit;
//     };
//   }, []);

//   return <div id="google_translate_element" />;
// };

// export default GoogleTranslate;

import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Function to initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL, // Horizontal layout
        },
        'google_translate_element'
      );
    };

    // Check if script is already present to prevent duplication
    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      // If script is already loaded, reinitialize
      window.googleTranslateElementInit();
    }

    return () => {
      // Optional: Cleanup to prevent duplicate initializations if needed
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;
