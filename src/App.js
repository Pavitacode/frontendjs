
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import Main from './main';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/main" element={<Main />} />
            </Routes>
        </Router>
    );
}
export default App;