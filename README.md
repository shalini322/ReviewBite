# 🍔 ReviewBite
**The Future of Dining Discovery**  

ReviewBite is a full-stack platform that leverages a multi-agent approach to rank and review restaurants. It offers a real-time leaderboard, sentiment-based analysis of user feedback, and dedicated portals for different user roles.

---

## 📁 Project Structure
The project follows a decoupled **Client-Server architecture**.

### ⚙️ Core Functionalities
- Real-time restaurant ranking
- AI-powered sentiment analysis of reviews
- Multi-role access: Users, Owners, Admins

---

## 👤 User Flow (Foodies)
1. **Authentication**  
   - Users can sign up and log in.  
   - Profile pictures are uploaded as Base64 strings and stored via Cloudinary.

2. **Discovery**  
   - Browse AI-ranked restaurants across multiple locations.

3. **Feedback & Reviews**  
   - Submit detailed reviews for visited restaurants.

4. **Sentiment Analysis**  
   - Reviews are processed using NLP (`sentimentService.js`) to classify feedback as positive, negative, or neutral.

---

## 🏪 Owner Flow (Partners)
1. **Restaurant Onboarding**  
   - Owners can register their business and create a specialized restaurant profile.

2. **Management Dashboard**  
   - Manage restaurant details, view customer feedback, and track ranking in real-time.

3. **Business Growth**  
   - Enhance visibility among local foodies through quality service and positive reviews.

---

## 🏆 Real-Time Leaderboard & Ranking
- **Redis Integration**: Ensures leaderboard updates instantly without heavy database queries.  
- **Dynamic Scoring**: Restaurant scores are calculated based on review volume and sentiment.  
- **Competitive Ranking**: Users can quickly see the top-rated restaurants.

---

## 🛡️ Admin Oversight
- **System Management**: Admins oversee all users, owners, and restaurant listings.  
- **Privilege Control**: Admins can verify accounts and assign system-level privileges to maintain platform integrity.

---

## 🛠️ Tech Stack
| Layer        | Technologies |
| ------------ | ------------ |
| Frontend     | React.js (Vite), Tailwind CSS, Lucide Icons, Axios |
| Backend      | Node.js, Express.js |
| Database     | MongoDB (Primary), Redis (Leaderboard caching) |
| Media        | Cloudinary (Base64 image uploads) |
| Deployment   | Frontend: Vercel, Backend: Render |

---

## 🚀 Environment Setup
To run the project locally, create a `.env` file in the backend directory with the following keys:

```env
PORT=5000
VITE_API_URL=
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_MASTER_KEY=your_admin_key
REDIS_URL=your_redis_connection_string
CLOUDINARY_URL=your_cloudinary_url
