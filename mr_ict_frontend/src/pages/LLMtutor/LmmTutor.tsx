import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import api from '../../services/apiClient';
import BranchHistory from './BranchHistory';
import { baseUrl } from '../../constants';

const LmmTutor = () => {
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(300);
  const [progress, setProgress] = useState(0);
  const [assignmentFeedback, setAssignmentFeedback] = useState('');
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    api
      .get('llm-tutor/api/lesson/semantic_html_101')
      .then((res) => {
        const data = res.data;
        setEstimatedDuration(data.estimated_duration);
        setSteps(data.steps);
        setProgress((step / data.steps.length) * 100);
      })
      .catch((err) => console.error('Error fetching lesson data:', err));
  }, [step]);
  

  const handleCodeChange = async (newCode) => {
    setCode(newCode);
    setError('');
    setAssignmentFeedback('');
    try {
      const response = await api.post('llm-tutor/api/llm/update', {
        code: newCode,
        step,
        lesson_id: 'semantic_html_101',
      });
      const data = response.data;
  
      setExplanation(data.explanation);
      setTotalDuration((prev) => prev + data.interaction_duration);
      if (data.assignment_feedback) {
        setAssignmentFeedback(data.assignment_feedback);
      }
    } catch (error) {
      console.error('Error fetching LLM explanation:', error);
      setError('Failed to get tutor response. Please try again.');
      setExplanation('');
    }
  };
  

  const handleAskQuestion = async () => {
    setError('');
    setAssignmentFeedback('');
    try {
      const response = await api.post('llm-tutor/api/llm/ask', {
        code,
        question,
        lesson_id: 'semantic_html_101',
        step,
      });
      const data = response.data;
  
      const answerText = data.answer;
      setAnswer(answerText);
      setTotalDuration((prev) => prev + data.interaction_duration);
      const utterance = new SpeechSynthesisUtterance(answerText);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error fetching LLM answer:', error);
      setError('Failed to get tutor response. Please try again.');
      setAnswer('');
    }
  };

  
  const jumpToStep = async (newStep) => {
    setStep(newStep);
    const stepData = steps.find(s => s.step_number === newStep);
    setCode(stepData?.expected_code || '');
    await handleCodeChange(stepData?.expected_code || '');
    setProgress((newStep / steps.length) * 100);
  };

  const selectBranch = async (branchCode, branchStep) => {
    setStep(branchStep);
    setCode(branchCode);
    await handleCodeChange(branchCode);
    setProgress((branchStep / steps.length) * 100);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="w-full bg-graydark rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm mt-1">
          Progress: {progress.toFixed(0)}% | Estimated Time: {estimatedDuration}s | Actual Time: {totalDuration.toFixed(1)}s
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Editor
            height="400px"
            language="html"
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 16 }}
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-wrap gap-2 mb-4">
            {steps.map(step => (
              <button
                key={step.step_number}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => jumpToStep(step.step_number)}
              >
                Step {step.step_number}: {step.description}
              </button>
            ))}
          </div>

          
          <div className="border p-4 rounded bg-gray-100 mt-4">
            <h3 className="font-bold text-lg">Tutor Explanation</h3>
            {error && <p className="text-red-500">{error}</p>}
            <p className="mt-2">{explanation}</p>
            {assignmentFeedback && (
              <p className="mt-2 text-green">{assignmentFeedback}</p>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask the tutor..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="bg-green text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
              onClick={handleAskQuestion}
            >
              Ask Tutor
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <p className="mt-2">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LmmTutor;
