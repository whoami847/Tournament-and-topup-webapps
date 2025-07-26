# 🏆 Tournament Management Web Application

A comprehensive tournament management platform built with Next.js 15, featuring real-time tournaments, payment integration, user management, and admin dashboard.

## 🚀 Features

### 🎮 Core Features

#### Tournament Management
- **Create & Manage Tournaments**: Full tournament lifecycle management
- **Multiple Game Support**: PUBG Mobile, Free Fire, Call of Duty Mobile, and more
- **Tournament Formats**: Battle Royale (BR), Classic (CS), Lone Wolf
- **Team Management**: Solo, Duo, Squad modes
- **Live Bracket System**: Real-time tournament brackets with match progression
- **Point System**: Kill points and placement-based scoring
- **Result Submission**: Players can submit match results with admin approval
- **Room ID & Password**: Automatic generation for matches

#### Payment System
- **Multiple Payment Gateways**: Integrated with RupantorPay
- **Tournament Entry Fees**: Secure payment processing
- **Wallet System**: In-app wallet with top-up functionality
- **Manual Payment Options**: Support for manual payment verification
- **Payment History**: Complete transaction tracking
- **Automated Prize Distribution**: Winner prize management

#### User Management
- **Authentication**: Email/password with Firebase Auth
- **User Profiles**: Customizable player profiles with avatars
- **Gamer ID Management**: Link gaming accounts
- **Role-based Access**: Player, Admin roles
- **Leaderboard**: Global player rankings
- **Notification System**: Real-time notifications

#### Games & Categories
- **Game Library**: Comprehensive game collection
- **Category Management**: Organize games by categories
- **Featured Games**: Highlight popular games
- **Game Details**: Detailed game information and rules

### 🛠️ Admin Dashboard

#### Tournament Management
- **Create/Edit Tournaments**: Full tournament configuration
- **Participant Management**: Monitor and manage participants
- **Result Approval**: Review and approve match results
- **Prize Distribution**: Manage winner prizes

#### User Administration
- **User Management**: View, edit, block/unblock users
- **Transaction Monitoring**: Track all financial transactions
- **Top-up Requests**: Approve wallet top-up requests
- **Withdraw Requests**: Process withdrawal requests

#### System Configuration
- **Payment Gateway Settings**: Configure payment providers
- **Game Management**: Add/edit games and categories
- **Banner Management**: Featured tournament banners
- **Notification System**: Send system-wide notifications
- **Settings Management**: Global application settings

#### Financial Management
- **Payment Orders**: Monitor all payment transactions
- **Withdraw Methods**: Configure withdrawal options
- **Top-up Settings**: Configure wallet top-up options
- **Revenue Analytics**: Financial reporting and insights

### 🎨 User Interface

#### Modern Design
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Theme switching support
- **Animated Components**: Framer Motion animations
- **Loading States**: Skeleton loaders and proper loading indicators
- **Toast Notifications**: User feedback system

#### Navigation
- **Intuitive Layout**: Easy-to-navigate interface
- **Search & Filters**: Advanced filtering options
- **Breadcrumbs**: Clear navigation paths
- **Mobile Menu**: Responsive mobile navigation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend & Database
- **Firebase Firestore**: NoSQL database
- **Firebase Auth**: Authentication service
- **Firebase Storage**: File storage (if applicable)
- **API Routes**: Next.js API routes for server-side logic

### Payment Integration
- **RupantorPay**: Primary payment gateway
- **Payment Callbacks**: Secure payment verification
- **IPN Handling**: Instant Payment Notifications

### State Management
- **Zustand**: Lightweight state management
- **React Hooks**: Built-in state management
- **Custom Hooks**: Reusable logic

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Capacitor**: Mobile app development (configured)

## 📱 Mobile Support

The application is configured with Capacitor for mobile app deployment:
- **iOS Support**: Ready for iOS app deployment
- **Android Support**: Ready for Android app deployment
- **Progressive Web App**: PWA capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- Payment gateway account (RupantorPay)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd tournament-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env.local` file:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Payment Gateway
NEXT_PUBLIC_PAYMENT_GATEWAY_URL=your_payment_url
PAYMENT_GATEWAY_SECRET=your_secret_key
```

4. **Firebase Setup**
- Configure Firestore security rules (see `firestore.rules`)
- Set up Firebase Authentication
- Initialize required collections

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:9002` to see the application.

### Available Scripts

```bash
# Development
npm run dev                 # Start development server on port 9002
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run typecheck          # Run TypeScript type checking

# Genkit AI (if used)
npm run genkit:dev         # Start Genkit development
npm run genkit:watch       # Start Genkit with file watching
```

## 🏗️ Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── games/            # Game-related pages
│   ├── tournaments/      # Tournament pages
│   ├── profile/          # User profile pages
│   ├── wallet/           # Wallet pages
│   └── ...
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Radix UI)
│   ├── admin/           # Admin-specific components
│   └── ...
├── lib/                 # Utility libraries
│   ├── firebase.ts      # Firebase configuration
│   ├── payments.ts      # Payment utilities
│   └── ...
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── context/             # React context providers
```

## 🔧 Configuration

### Firebase Security Rules
The project includes Firestore security rules in `firestore.rules`. Make sure to deploy these rules to your Firebase project.

### Payment Gateway Configuration
Configure payment gateways in the admin dashboard under Settings > Payment Gateways.

### App Hosting
The project includes `apphosting.yaml` for deployment configuration.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy

### Firebase Hosting
1. Install Firebase CLI
2. Configure `firebase.json`
3. Deploy with `firebase deploy`

### Other Platforms
The application can be deployed to any platform that supports Next.js applications.

## 🔐 Security Features

- **Authentication**: Secure user authentication with Firebase
- **Payment Security**: Secure payment processing with verification
- **Data Validation**: Input validation with Zod schemas
- **API Security**: Protected API routes with authentication
- **Role-based Access**: Admin and user role separation

## 📊 Analytics & Monitoring

- **User Analytics**: Track user engagement and behavior
- **Payment Monitoring**: Monitor payment success rates
- **Performance Tracking**: Application performance metrics
- **Error Logging**: Comprehensive error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Future Enhancements

- **Live Streaming Integration**: Stream tournament matches
- **Advanced Analytics**: Detailed performance analytics
- **Social Features**: Player messaging and teams
- **API Integration**: Third-party game APIs
- **Machine Learning**: AI-powered match predictions
- **Multi-language Support**: Internationalization

---

**Built with ❤️ by the Tournament App Team**
