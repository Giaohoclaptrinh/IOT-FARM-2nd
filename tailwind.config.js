

 /** @type {import('tailwindcss').Config} */
 export default {
    content: ["./src/**/*.{html,js,jsx}"],
    theme:{

    },
    theme: {
      extend: {
        colors:{
            testColor:"#ebebeb"

        }
      },
    },
    plugins: [require('mytailwind')],
    prefix:"tw-"
  }