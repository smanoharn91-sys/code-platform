import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { useLocation } from 'react-router-dom';

function CodeEditor({ problem }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [input, setInput] = useState(problem.testCases[0].input);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const contestId = query.get('contestId');

  useEffect(() => {
    ace.config.set('useWorker', false);
  }, []);

  const languages = [
    { value: 'c', label: 'C', mode: 'c_cpp' },
    { value: 'cpp', label: 'C++', mode: 'c_cpp' },
    { value: 'java', label: 'Java', mode: 'java' },
    { value: 'python', label: 'Python', mode: 'python' },
    { value: 'javascript', label: 'JavaScript', mode: 'javascript' },
  ];

  const runCode = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const expectedOutput = problem.testCases.find(tc => tc.input === input)?.output;
      const response = await axios.post(
        `${apiUrl}/api/code/run`,
        { code, language, input, problemId: problem.id, expectedOutput, contestId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setOutput(response.data.output);
      setError('');
      if (response.data.status === 'Accepted') {
        setOutput(prev => `${prev}\n✅ Test case passed! Problem completed!`);
      } else {
        setOutput(prev => `${prev}\n❌ Test case failed! Expected: ${expectedOutput}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error running code');
      setOutput('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Code Editor</h3>
      <select
        onChange={e => setLanguage(e.target.value)}
        value={language}
        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <AceEditor
        mode={languages.find(lang => lang.value === language).mode}
        theme="monokai"
        value={code}
        onChange={setCode}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="400px"
        className="mb-4"
      />
      <h4 className="text-md font-bold mb-2">Input</h4>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter input"
        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={runCode}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded hover:from-blue-600 hover:to-blue-800 transition"
      >
        Run Code
      </button>
      {output && (
        <div className="mt-4">
          <h4 className="text-md font-bold">Output</h4>
          <pre className="p-2 bg-gray-50 rounded">{output}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <h4 className="text-md font-bold">Error</h4>
          <pre className="p-2 bg-gray-50 rounded text-red-500">{error}</pre>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;