import React from "react";


export default function TestApi() {
	//const [data, setData] = useState<any>([]);



	// check if backend can connect to backend
    // also check if frontend can connect backend
    React.useEffect(() => {
        fetch("http://localhost:3001/trading/test")
          .then((res) => res.json())
          .then((data) => {
						console.log(data.result);
						
					})
      }, []);
    

    return (        
        <>
            <div>ABC</div>

        </>
    )
}

