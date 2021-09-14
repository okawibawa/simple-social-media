import './App.css';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

// pages
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import DetailPostPage from './pages/DetailPost';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/auth" component={AuthPage} />
        <Route exact path="/detail-post/:postId" component={DetailPostPage} />
      </Switch>
    </Router>
  );
}

export default App;
