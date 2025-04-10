# capstone-PlaylistCrusaders

## Deliverables 
- Proposal 
- Wireframes
- Database Schema

## Problem Statement

Context: Music is a powerful form of expression, and sharing playlists has become a popular way for fans to bond, discover new music, and showcase taste. However, while platforms exist to stream music, there’s no streamlined, community-focused way for users to share playlists and receive feedback from others who share their musical interests.

Core Problem: There is no dedicated platform where music fans can easily share their playlists and get meaningful feedback in the form of likes or engagement.

Impact on Users: Music lovers who enjoy curating playlists lack a space to showcase their work and connect with others who appreciate similar sounds. This leads to missed opportunities for connection, expression, and discovery through other listeners. Users may feel unmotivated to share their playlists publicly or frustrated by the lack of engagement they receive on traditional platforms.

Opportunity for Solution: A dedicated web app that allows users to upload, share, and like playlists would foster a vibrant, interactive community centered around music curation.

## Technical Solution 

Overview of the Solution: We will develop a full-stack web application that allows users to create, share, and engage with music playlists in a social environment. Users will be able to upload songs using existing streaming services, and receive feedback from the community through likes. The application will focus on community-driven music discovery and curation, offering a space for music fans to express themselves and connect through shared tastes.

Key Features and Functionalities:

 - User Authentication: Users can register and log in using secure credentials. Social login (e.g., Google, Spotify) may also be supported for convenience.

 - Like System: Other users can view and like playlists. Playlists with more likes gain more visibility on the platform.

 - User Profiles: Each user has a public profile showing their shared playlists, liked playlists, and bio.

 - Responsive Design: The application will be mobile-friendly for on-the-go browsing and sharing.

Technology Stack: 
 - Frontend: React for building interactive UIs with dynamic features.
 - Backend: Spring Boot for creating a secure REST API to handle user authentication, run management, and data storage.
 - Database: MySQL to store user and run data, including relationships between users and runs.
 - SoundCloud API (TBD): Song integration and gathering song metadata 
 - Authentication: JWT (JSON Web Token) for secure user login and role management.

## Glossary

### Playlist
A curated list of songs, typically grouped around a theme, mood, or genre. In this application, users can share playlists by submitting links from supported streaming platforms (e.g., SoundCloud Spotify).

### Like
A form of positive feedback that users can give to playlists they enjoy. Likes serve as a way to validate and promote playlists within the platform, influencing what appears in trending or popular feeds.

### Feed
The main area of the application where users can browse playlists shared by others. The feed may include trending, recent, or recommended playlists.

### User Profile
A personal page that displays a user's uploaded playlists, liked playlists, bio, and profile picture. It serves as a public identity within the app's community.

### Streaming Platform Link
A URL linking to an external music streaming service (e.g., a SoundCloud song URL). The application does not host music directly, but facilitates the sharing of content available on these platforms.

## High Level Requirements

### Manage 4-7 database tables (entities) that are independent concepts.
MySQL for data management
Spring Boot, MVC, JDBC, Testing, React
An HTML and CSS UI that's built with React
Sensible layering and pattern choices
A full test suite that covers the domain and data layers
Roles: User & Admin


### Manage Database Tables
Will design and implement 4-7 independent database entities that represent different core concepts within the application. These entities will not simply be connected via a bridge table but will each have unique attributes and relationships to other entities. For example, we will create separate tables for users, running clubs, runs, and memberships.

### MySQL for Data Management
Will use MySQL as the relational database management system for storing and retrieving data. Will design the schema to ensure data integrity and optimize query performance. We'll use Spring Data JPA with MySQL to manage the entities and perform CRUD operations.

### Spring Boot, MVC, JDBC, Testing, React
Will implement the backend of the application using Spring Boot, utilizing the MVC (Model-View-Controller) architecture for organizing the application structure. The JDBC will be used for database connections and data transactions. For the frontend, will build the UI with React, ensuring it is responsive and functional. Will also write unit and integration tests to ensure that both the backend and frontend meet the application requirements.

### An HTML and CSS UI Built with React
Will create the user interface using React, ensuring a clean, user-friendly design with HTML and CSS. Will follow modern web development practices, including responsive design to ensure the app works on both mobile and desktop devices. The layout will be organized and intuitive for users to browse and create playlists.

### Sensible Layering and Pattern Choices
Will follow best practices for application architecture, utilizing layered design patterns. This includes separating the logic into distinct layers such as controller, service, and repository. Will ensure that the backend follows the Single Responsibility Principle and that the code is easy to maintain and scale.

### A Full Test Suite that Covers the Domain and Data Layers
Will implement a comprehensive test suite for the project. This will include unit tests for the domain layer (services and models) and the data layer (repositories and database interactions).

### Must Have at Least 2 Roles
Will implement role-based access control using Spring Security. The system will have two roles: User and Admin. Users will be able to sign up, create playlists, and view public playlists , while admins will have privileges to delete and view any playlists. Will ensure the roles are securely handled through authentication and authorization.

## User Stories

### Create a Playlist

**Description:**  
Create a playlist that users can listen to and leave likes on.

**Suggested Data:**
- **User**
  - **Username:** 5–15 characters, character restrictions apply, must be unique.
  - **Password:** 5–23 characters, must include at least one uppercase letter and one special character.
- **Playlist**
- **Song:** Built from SoundCloud API, must be a valid SoundCloud URL.

**Preconditions:**
- User must be logged in with the `MEMBER` or `ADMIN` role to like, create, or edit playlists.

**Post-conditions:**
- If the user is an `ADMIN`, they can:
  - Delete any user's playlist.
  - Potentially disable/suspend users.

### Browse Playlists

**Description:**  
Display playlists to anyone using the application.

**Views:**
- **Home:** Shows recent playlists and allows sorting by other methods.
- **User Profile:** Displays all public playlists created by the user.
- **Likes:** View all playlists liked by a specific user.

**Preconditions:** None  
**Post-conditions:** None

### Like a Playlist

**Description:**  
Users can like playlists to show appreciation and save them.

**Preconditions:**
- User must be logged in.

**Post-conditions:**
- Playlist receives +1 like.
- Playlist is added to the user’s “Liked playlists” collection.

### Repository Tasks

**Playlist**
- `findByUser`
- `findByUserLikes`
- `create`
- `update`
- `delete`

**Song**
- `findByPlaylist`
- `create`
- `delete`

**User**
- `create`
- `update`
- `findById`


### Service Tasks

- `UpdateLike`: Update like count and send socket update to frontend.
- `GetPlaylists`: Fetch playlists and associated songs.
- `GetUser`: Handle login and user retrieval.
- `UpdatePlaylist`
- `DeletePlaylist`
- `CreatePlaylist`
- `AddSong`
- `DeleteSong`


### Tests

- Test "found" and "not found" cases.
- Sample SoundCloud URL and data for song testing.
- Username validation: length, character restrictions.
- Password validation: length, special character check, uppercase requirement.


### Controller Responsibilities

- **Playlist Controller:** Full CRUD functionality.
- **Song Controller:** Create, Read, Delete functionality.
- **User Controller:** Full CRUD functionality.

**Preconditions (All Controllers):**
- User must be logged in with the `MEMBER` or `ADMIN` role to perform most actions (e.g., like, create, edit).

**Post-conditions:**
- `ADMIN` users can delete any playlist or potentially suspend users.
- When creating events (like runs or scheduled playlists):
  - If the user is a `MEMBER`, the run/playlist is set to **pending**.
  - If the user is an `ADMIN`, they can choose to post it immediately or keep it pending.

## Learning Goal 

### Learning Goal: Learn how to use TypeScript in a full-stack React + Spring Boot web application.

**Application:**  
Use TypeScript to strongly type all frontend components, props, state, and API interaction layers in the React application. It will help improve code maintainability and prevent bugs in complex features like the audio player, playlist management, and user data handling.

**Research and Resources:**  
Will start with the [official TypeScript documentation](https://www.typescriptlang.org/docs/), use the React TypeScript Cheatsheet, and follow a few YouTube tutorials on migrating a JavaScript app to TypeScript. Also reference GitHub repos that use TS + React.

**Challenges:**  
We anticipate needing to learn how to type things like React event handlers, API responses, and component props effectively. The challenges will mainly involve setting up the Create React App with TypeScript, getting it started properly, and ensuring consistency in data types across components.

**Success Criteria:**  
If the entire React frontend is built in TypeScript with strong typing across components and backend API responses, and without falling back to `any`, then I’ll consider this learning goal achieved. Autocomplete, error checking, and refactoring should also be improved.


### Learning Goal: Learn how to implement real-time feedback using WebSockets.

**Application:**  
Will use WebSockets to create a real-time "like" button feature for tracks. When one user clicks 'like', all other users currently on the site will instantly see the updated like count without needing to refresh. This adds a social and interactive component to the app.

**Research and Resources:**  
Plan on using `socket.io`, so will start with the official Socket.IO documentation. Also will review tutorials on how to integrate Socket.IO with Spring Boot (on the backend) and React (on the frontend), and look through GitHub repos or blog posts that use similar implementations.

**Challenges:**  
Integrating Socket.IO with Spring Boot isn’t as direct as with Node.js, so will need to figure out how to properly configure the backend to handle WebSocket connections. On the frontend, will need to manage state updates smoothly and handle cleanup when components unmount. Will test with dummy sockets first and look into fallback handling in case connections drop.

**Success Criteria:**  
If multiple users on the app can see likes appear in real-time as they’re clicked — without needing to refresh — then will consider this a success.


## Class Diagram 

### Key Entities and Their Relationships:

#### 1. **User**
   - **Attributes**:
     - `id: int`
     - `username: string`
     - `email: string`
     - `password: string`
   - **Methods**:
     - `login()`
     - `logout()`
     - `updatePassword()`
     - `disableAccount()`
   - **Relationships**:
     - A `User` can have many `Playlists` (1-to-many relationship).
     - A `User` can like many `Playlists` via `Like` (many-to-many relationship).
     - A `User` has a role via the `User_Role` table (many-to-many relationship).

#### 2. **Role**
   - **Attributes**:
     - `role_id: int`
     - `role_name: enum` (e.g., 'admin', 'user', 'suspended')
   - **Methods**:

   - **Relationships**:
     - A `Role` can be assigned to many `Users` via the `User_Role` table.

#### 3. **Playlist**
   - **Attributes**:
     - `id: int`
     - `name: string`
     - `description: string`
     - `public: boolean`
     - `created_at: datetime`
     - `updated_at: datetime`
     - `user_id: int` (Foreign key to `User`)
   - **Methods**:
     - `create()`
     - `update()`
     - `delete()`
   - **Relationships**:
     - A `Playlist` belongs to a `User` (many-to-one relationship).
     - A `Playlist` can contain many `Songs` via the `Playlist_Song` table (many-to-many relationship).
     - A `Playlist` can be liked by many `Users` via the `Like` table (many-to-many relationship).

#### 4. **Song**
   - **Attributes**:
     - `id: int`
     - `url: string`
     - `artist: string`
     - `name: string`
     - `artwork: string` (URL to artwork)
   - **Methods**:
     - `add()`
     - `delete()`
   - **Relationships**:
     - A `Song` can appear in many `Playlists` via the `Playlist_Song` table (many-to-many relationship).

#### 5. **Like**
   - **Attributes**:
     - `id: int`
     - `user_id: int` (Foreign key to `User`)
     - `playlist_id: int` (Foreign key to `Playlist`)
   - **Methods**:
     - `toggleLike()`
   - **Relationships**:
     - A `Like` is associated with one `User` and one `Playlist` (many-to-one relationships).

#### 6. **Playlist_Song**
   - **Attributes**:
     - `id: int`
     - `playlist_id: int` (Foreign key to `Playlist`)
     - `song_id: int` (Foreign key to `Song`)
   - **Methods**:
     - `addToPlaylist()`
     - `removeFromPlaylist()`
   - **Relationships**:
     - This table represents a many-to-many relationship between `Playlist` and `Song`.

#### 7. **User_Role**
   - **Attributes**:
     - `user_id: int` (Foreign key to `User`)
     - `role_id: int` (Foreign key to `Role`)
   - **Methods**:
     - `assignRole()`
     - `removeAdmin()` (admin removal protection in assignRole)
   - **Relationships**:
     - This table represents a many-to-many relationship between `User` and `Role`.


### Visual Representation:

- **User** -> **Playlist** (1-to-many)
- **User** -> **Like** -> **Playlist** (many-to-many via `Like`)
- **Playlist** -> **Song** (many-to-many via `Playlist_Song`)
- **User** -> **Role** (many-to-many via `User_Role`)



## Class List

```
Package/Class Overview

src
├───main
│   └───java
│       └───learn
│           └───playlist
│               │   App.java                      -- app entry point
│               │
│               ├───data
│               │       DataException.java        -- data layer custom exception
│               │       PlaylistRepository.java   -- playlist repository
│               │       SongRepository.java       -- song repository
│               │       UserRepository.java       -- user repository
│               │
│               ├───domain
│               │       PlaylistService.java      -- business logic for playlists
│               │       SongService.java          -- business logic for songs
│               │       UserService.java          -- business logic for user
│               │
│               ├───models
│               │       Playlist.java             -- playlist model
│               │       Song.java                 -- song model
│               │       User.java                 -- user model
│               │
│               └───ui
│                       Controller.java           -- UI controller for all interactions
│                       View.java                 -- console input/output views
│
└───test
    └───java
        └───learn
            └───playlist
                ├───data
                │       PlaylistRepositoryTest.java    -- Playlist repository tests
                │       SongRepositoryTest.java        -- Song repository tests
                │       UserRepositoryTest.java        -- User repository tests
                │
                └───domain
                        PlaylistServiceTest.java       -- Playlist service tests
                        SongServiceTest.java           -- Song service tests
                        UserServiceTest.java           -- User service tests
```

# Task List with Estimated Time

## **Frontend Development (React)**

### 1. Setup
- **Tasks:**
  - Initialize React project.
  - Install necessary dependencies (React, React Router, WebSocket, etc.).
  - Set up project structure with folders for components, pages, and services.
- **Estimated Time:** 1-2 hours

### 2. Audio Player Component
- **Tasks:**
  - Create a functional `AudioPlayer` component.
  - Set up state for current track, isPlaying, etc.
  - Add audio controls (play/pause, next/prev).
- **Estimated Time:** 3-4 hours

### 3. Playlist & Song Components
- **Tasks:**
  - Create a `Playlist` component to display a list of playlists.
  - Create a `Song` component for displaying individual songs and their info.
  - Implement functionality to add songs to playlists.
- **Estimated Time:** 3-4 hours

### 4. Playlist CRUD
- **Tasks:**
  - Implement frontend logic for creating, updating, and deleting playlists.
  - Create forms for adding/editing playlists.
  - Display the playlists to users and handle interactions.
- **Estimated Time:** 3-4 hours

### 5. Like Playlist
- **Tasks:**
  - Implement functionality for users to like playlists.
  - Update frontend to reflect liked playlists.
- **Estimated Time:** 3-4 hours

### 6. User Profile
- **Tasks:**
  - Build out user profiles.
  - Display all user created playlists.
  - Display all user liked playlists.
- **Estimated Time:** 3-4 hours

### 7. User Authentication
- **Tasks:**
  - Implement login functionality.
  - Set up authentication (JWT or cookie-based).
  - Implement role-based access control for users (Admin/MEMBER).
- **Estimated Time:** 4-5 hours

### 8. Final Touches & Styling
- **Tasks:**
  - Style the components using CSS and Bootstrap.
  - Ensure a responsive design for different screen sizes.
  - Polish UI/UX with animations or transitions where necessary.
- **Estimated Time:** 4-5 hours


## **Backend Development (Spring Boot)**

### **1. Model Layer**
- **Tasks:**
  - Define entities: `User`, `Playlist`, `Song`.
  - Set up JPA annotations and relationships (e.g., One-to-Many, Many-to-Many).
  - Add necessary fields and constraints (e.g., `username`, `password`, `created_at`).
- **Estimated Time:** 2-3 hours

### **2. Repository Layer**
- **Tasks:**
  - Create repository interfaces for each model: `UserRepository`, `PlaylistRepository`, `SongRepository`.
  - Define custom queries for finding playlists by user, songs by playlist, etc.
  - Set up methods for basic CRUD operations (e.g., `save()`, `delete()`, `findById()`).
- **Estimated Time:** 2-3 hours

### **3. Service Layer**
- **Tasks:**
  - Implement business logic for managing users, playlists, and songs.
  - Create methods for adding, updating, deleting playlists and songs.
  - Implement validation and error handling.
  - Integrate the repository layer to fetch and manipulate data.
- **Estimated Time:** 3-4 hours

### **4. Controller Layer**
- **Tasks:**
  - Create REST controllers for `User`, `Playlist`, and `Song`.
  - Implement endpoints for CRUD operations (e.g., `GET /playlists`, `POST /songs`).
  - Set up input validation and return appropriate responses (status codes, messages).
  - Implement role-based access control (Admin/MEMBER) for managing playlists and songs.
- **Estimated Time:** 3-4 hours

### **5. Testing**
- **Tasks:**
  - **Unit Tests:**
    - Write tests for the repository layer (mock data, test CRUD operations).
    - Write service layer tests to ensure business logic works as expected.
  - **Integration Tests:**
    - Test the full flow of API calls, including authentication and authorization.
    - Write tests for CRUD operations on playlists and songs.
  - **API Tests:**
    - Test endpoints for valid and invalid requests (e.g., missing fields, incorrect IDs).
  - Set up testing frameworks: JUnit, Mockito, Spring Test.
- **Estimated Time:** 6-7 hours

### **6. Bug Fixes & Refinement**
- **Tasks:**
  - Fix any issues found during testing.
  - Optimize service methods and database queries.
  - Ensure smooth integration between layers.
- **Estimated Time:** 6-7 hours


## **Database Management (MySQL)**

### **1. Database Schema**
- **Tasks:**
  - Design the MySQL database schema for `User`, `Playlist`, `Song`.
  - Create necessary tables, columns, and relationships (e.g., foreign keys).
  - Implement constraints like unique usernames, password validation, etc.
- **Estimated Time:** 2-3 hours

### **2. Database Integration**
- **Tasks:**
  - Integrate Spring Boot with MySQL using JDBC.
  - Ensure repository layer is connected to MySQL.
- **Estimated Time:** 2-3 hours

---

- **Total Time:** 50-66 hours
