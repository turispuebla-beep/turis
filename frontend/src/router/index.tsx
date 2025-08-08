import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { NewsList } from '../components/news/NewsList';
import { NewsDetail } from '../components/news/NewsDetail';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { TeamList } from '../components/teams/TeamList';
import { TeamDetail } from '../components/teams/TeamDetail';
import { TeamForm } from '../components/teams/TeamForm';
import { MatchForm } from '../components/matches/MatchForm';
import { EventForm } from '../components/events/EventForm';
import { PlayerForm } from '../components/players/PlayerForm';
import { TeamStats } from '../components/stats/TeamStats';
import { GlobalStats } from '../components/stats/GlobalStats';
import { Predictions } from '../components/predictions/Predictions';
import { TeamManagement } from '../components/admin/TeamManagement';
import { Profile } from '../pages/profile/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <NewsList />,
      },
      {
        path: 'news/:id',
        element: <NewsDetail />,
      },
      {
        path: 'teams',
        element: <TeamList />,
      },
      {
        path: 'teams/new',
        element: (
          <ProtectedRoute>
            <TeamForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:id',
        element: <TeamDetail />,
      },
      {
        path: 'teams/:id/edit',
        element: (
          <ProtectedRoute>
            <TeamForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/matches/new',
        element: (
          <ProtectedRoute>
            <MatchForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/matches/:matchId/edit',
        element: (
          <ProtectedRoute>
            <MatchForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/events/new',
        element: (
          <ProtectedRoute>
            <EventForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/events/:eventId/edit',
        element: (
          <ProtectedRoute>
            <EventForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/players/new',
        element: (
          <ProtectedRoute>
            <PlayerForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/players/:playerId/edit',
        element: (
          <ProtectedRoute>
            <PlayerForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/stats',
        element: <TeamStats />,
      },
      {
        path: 'stats',
        element: <GlobalStats />,
      },
      {
        path: 'admin/teams',
        element: (
          <ProtectedRoute>
            <TeamManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId/predictions',
        element: <Predictions />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}