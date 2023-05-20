
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import Main from './main';
import ImageUploader from './imageUploader';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/main" element={<Main />} />
                <Route path="/imageUploader" element={<ImageUploader />} />
            </Routes>
        </Router>
    );
}
export default App;