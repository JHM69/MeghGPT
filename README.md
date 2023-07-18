# MeghBuzz_GPT

MeghBuzz_GPT is a unique platform that combines the power of various APIs to provide an interactive storytelling experience, tour planner, and normal prompting with input, text files, images, and voice commands. Users can upload their own files, generate prompts using ChatGPT API, create anime-style pictures with DALL-E 2, convert text to voice using ElavenLabs API, and can share their creations as PDF books. This README file provides a comprehensive guide to understanding and using the project effectively.

#
[Problem Statement](https://docs.google.com/document/d/e/2PACX-1vTF8r8UbzjBHGxu2h00OakQ1vRjs85xAOOZEIB2Ea8SNOwTbW2-V-6JACmOzN2Ar4Pxj2LyIXptrng3/pub)
#
[Our Solution.pdf](https://drive.google.com/file/d/1SmoWLlG0quZ0yk3zojX-hxmul7veoLw6/view?usp=sharing)

# Video
[![MeghGPT Demo](http://img.youtube.com/vi/4m-h20T_Atc/0.jpg)](http://www.youtube.com/watch?v=4m-h20T_Atc "MeghGPT Demo")

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

MeghBuzz_GPT aims to revolutionize storytelling by leveraging cutting-edge APIs and technologies. With this platform, users can upload their files, generate story prompts using ChatGPT, create anime-style pictures with DALL-E 2, convert text to voice using Elaven Labs, and share their creations as downloadable PDF books.

The project utilizes Next.js as the architecture for both the front-end and back-end. The database is implemented using MySQL. The integration of various APIs, such as Google Cloud Vision, ChatGPT, DALL-E 2, and Eleven Labs, enhances the storytelling experience by providing rich visual and auditory elements.

## Features

- **File Upload**: Users can upload their files to the platform, including images and text documents.
- **Prompt Generation**: The platform utilizes ChatGPT to generate story prompts based on the uploaded files.
- **Anime-Style Picture Generation**: DALL-E 2 is used to create anime-style pictures that complement the generated prompts.
- **Text-to-Speech Conversion**: Eleven Labs API converts the generated prompts to voice, enhancing the auditory storytelling experience.
- **PDF Generation**: The project converts the generated prompts, anime-style pictures, and voice recordings into a downloadable PDF book.
- **Sharing Platform**: Users can share their created PDF books with others, allowing them to view and download the books.

## Architecture

The architecture of the project follows the Next.js framework, which enables server-side rendering and provides a seamless experience for users. The back-end interacts with the APIs, including ChatGPT, DALL-E 2, and Eleven Labs, to generate the required content. MySQL is used as the database to store relevant information and user data.

The front-end is implemented using Next.js, allowing for efficient rendering and responsiveness. The user interface is designed to be intuitive and user-friendly, ensuring a smooth experience throughout the storytelling process.

### Usage

1. Start the development server:
   ```bash
   npm run dev
3. Access the application locally:
   ```bash
   http://localhost:3000

## API Integration

The project integrates several APIs to provide the desired functionalities:

-**Google Cloud Vision**: Used for image analysis and processing of uploaded images.

-**ChatGPT API**: Employs the GPT-3.5 model to generate story prompts based on user-uploaded files.

-**DALL-E 2 API**: Utilized to create anime-style pictures that accompany the story prompts.

-**Eleven Labs API**: Converts text prompts into voice recordings for an enhanced auditory experience.

To integrate these APIs, obtain the necessary API keys and configure them in the project's settings.


### Example: 

![Api Post](images/1.png)
![Api Post](images/2.png)
![Api Post](images/3.png)



If I sent the images to
```bash
var options = {
  method: 'POST',
  url: 'http://localhost:3000/api/chat',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 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'
  },
  data: {
    messages: [
      {role: 'system', content: 'tour'},
      {role: 'user', content: 'My Last Tour at Sylhet'},
      {
        role: 'user',
        content: 'Image 1 contains: Scenic Picturesque Lush Serene Green Crystal-clear Tropical Vibrant Captivating Tranquil'
      }
    ],
    model: 'gpt-3.5-turbo'
  }
};
```





## Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

To run the project, ensure that you have the following installed:

- Node.js (version X.X.X)
- npm (version X.X.X)
- MySQL (version X.X.X)

### Installation

1. Clone the GitHub repository:
   git clone https://github.com/JHM69/MeghBuzz_GPT.git
2. Navigate to the project directory:
   cd MeghBuzz_GPT
3. Install the dependencies:
   npm install

### Configuration

1. Create a MySQL database for the project.
2. Configure the database connection in the project's configuration files.
3. Obtain API keys for Google Cloud Vision, ChatGPT, DALL-E 2, and Eleven Labs.
4. Add the API keys to the project's configuration files.


## Contributing

We welcome contributions to enhance MeghBuzz_GPT. If you want to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes.
4. Test your changes thoroughly.
5. Commit and push your changes.
6. Submit a pull request detailing the changes you made.
   
We appreciate your contributions!

## License

MeghBuzz_GPT is released under the MIT License. Please refer to the LICENSE file for more details.

With MeghBuzz_GPT, users can unleash their creativity and storytelling skills. The integration of various APIs and technologies enables a seamless and immersive experience. Whether you're an avid storyteller or an anime enthusiast, MeghBuzz_GPT provides a unique platform to showcase your talent and share your creations with the world. Enjoy the journey of storytelling like never before!
