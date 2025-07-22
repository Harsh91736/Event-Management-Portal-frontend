import React from 'react';

const Footer = () => (
  <footer className="w-full py-4 bg-gray-100 text-center text-gray-500 text-sm border-t mt-8">
    &copy; {new Date().getFullYear()} Event Management System. All rights reserved.
  </footer>
);

export default Footer;
