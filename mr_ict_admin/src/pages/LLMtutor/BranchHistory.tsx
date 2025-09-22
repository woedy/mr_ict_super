import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../constants';

const BranchHistory = ({ lessonId, onSelectBranch }) => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}llm-tutor/api/branches/${lessonId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch branches');
        }
        return res.json();
      })
      .then((data) => {
        setBranches(data);
      })
      .catch((error) => {
        console.error('Error fetching branches:', error);
      });
  }, [lessonId]);
  
  
  return (
    <div className="mt-4">
      <h3 className="font-bold text-lg">Branch History</h3>
      <ul className="mt-2">
        {branches.map((branch) => (
          <li key={branch.branch_id} className="py-1">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => onSelectBranch(branch.code, branch.step.step_number)}
            >
              Step {branch.step.step_number} - {branch.timestamp}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BranchHistory;