// src/components/ui/NavBar.jsx
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import Button from './Button';  // This should work once Button.jsx is in the same directory

const Navbar = ({ onAddJob }) => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Job Search Dashboard
            </span>
          </div>
          <div className="flex items-center">
            <Button
              onClick={onAddJob}
              variant="primary"
              className="flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Job
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;