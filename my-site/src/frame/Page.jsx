import HomePage     from "../Pages/Home.jsx";
import RulesPage    from "../Pages/Rules.jsx";
import VenuePage    from "../Pages/Venue.jsx";
import SongsPage    from "../Pages/Songs.jsx";
import ProfilePage  from "../Pages/Profile.jsx"
import SubmitPage   from "../Pages/Submit.jsx"
import RsvpPage     from "../Pages/RSVP.jsx";
import LoginPage    from "../Pages/Login.jsx";
import ShowcasePage from "../Pages/Showcase.jsx";

import EmptyState   from "../components/EmptyState.jsx";

export default function Page({page, loggedIn, setLoggedIn, setFailure, setProfile, profile, setActivePageKey, clientId }) {
  if (!page?.enabled) {
    return (
      <EmptyState
        heading="Page disabled"
        sub="This page is currently turned off. Enable it in your settings to view content."
      />
    );
  }

  if (page.requiresAuth && !loggedIn) {
    return (
      <EmptyState
        heading="Login required"
        sub="You need to be logged in to see this page. Click the Log in button in the header."
      />
    );
  }

  switch (page.key) {
    case "home":
      return <HomePage loggedIn={loggedIn} setActivePageKey={setActivePageKey} />
      break;

    case "rules":
      return <RulesPage loggedIn={loggedIn} setActivePageKey={setActivePageKey} />
      break;

    case "venue":
      return <VenuePage loggedIn={loggedIn} setActivePageKey={setActivePageKey} profile={profile} />
      break;

    case "songs":
      return <SongsPage />;
      break;

    case "showcase":
      return <ShowcasePage />;
      break;

    case "rsvp":
      return <RsvpPage loggedIn={loggedIn} profile={profile} setProfile={setProfile} setFailure={setFailure} clientId={clientId} />
      break;

    case "login":
      return <LoginPage setLoggedIn={setLoggedIn} setProfile={setProfile} setActivePageKey={setActivePageKey} setFailure={setFailure} />
      break;

    case "profile":
      return <ProfilePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} profile={profile} setProfile={setProfile} setActivePageKey={setActivePageKey} />
      break;

    case "submit":
      return <SubmitPage loggedIn={loggedIn} profile={profile} setActivePageKey={setActivePageKey} />
      break;

    default:
      return <p>Unknown page.</p>;
  }
}