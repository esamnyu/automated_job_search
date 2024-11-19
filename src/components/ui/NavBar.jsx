// src/components/ui/Navbar.jsx
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from './Card';

const Navbar = ({ onAddJob }) => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-semibold">Job Tracker</span>
          </div>
          <Button 
            onClick={onAddJob}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;