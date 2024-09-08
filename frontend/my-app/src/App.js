import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import TestCasesPage from './TestCasesPage'; // Import the new component
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/test-cases" element={<TestCasesPage />} /> 
      </Routes>
    </Router>
  );
}
export default App;