import { ProgressBar, InfinitySpin } from "react-loader-spinner";


const LoaderPage = () => {
    return(
      <div className="container mx-auto flex justify-center items-center h-screen">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <InfinitySpin 
            width='200'
            color="#4fa94d"
          />
        </div>
    </div>
    )
  }

export default LoaderPage;