
export default function Profile() {

  const profileInfo = {
    name: "Junaid Ahmad",
    profile : "https://www.w3schools.com/howto/img_avatar.png",
    score : 100,
    email :"j7654894110@gmail.com",
    rank : 1,
  }


    return (
      <div className="flex flex-col border-black border-[2px] rounded-lg m-8 p-8">
        <div className="flex justify-center">
          <div className="flex flex-col w-1/2">
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={profileInfo.profile}
                    />
                    <div className="flex flex-col ml-2">
                      <p className="text-lg font-bold">{profileInfo.name}</p>
                      <p className="text-sm">{profileInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <p className="text-lg font-bold">{profileInfo.score}</p>
                  <p className="text-sm ml-1">Points</p>
                </div>
                    <p className="text-sm ml-1 font-bold">{profileInfo.rank} Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }