import { useSelector } from "react-redux";

function PlatformList() {

  const platforms = useSelector(
    (state) => state.platforms.platforms
  );

  return (

    <div className="card">

      <h2>Supported Platforms</h2>

      <div className="platforms">

        {platforms.map((platform, index) => (

          <div
            key={index}
            className="platform"
          >
            {platform}
          </div>

        ))}

      </div>

    </div>

  );
}

export default PlatformList;