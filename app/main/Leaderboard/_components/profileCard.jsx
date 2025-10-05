import React from "react";

const ProfileCard = ({ profile }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;500&family=Ysabeau+Office:wght@400;500&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

        .card {
          position: relative;
          width: 330px;
          height: 380px;
          background: rgba(15, 20, 30, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 0 40px rgba(0, 123, 255, 0.3);
        }
        .imgBx {
          position: absolute;
          top: -70px;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 180px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .imgBx img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .details {
          text-align: center;
          color: white;
          margin-top: 140px;
          padding: 0 20px;
        }
        .details h2 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #fff;
        }
        .details h2 span {
          font-size: 0.9rem;
          color: #9ca3af;
        }
        .interests {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        .interest-item {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .likes {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 20, 30, 0.95);
          border-radius: 30px;
          padding: 10px 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        }
        .likes img {
          width: 22px;
          height: 22px;
        }
        .likes-count {
          color: #60a5fa;
          font-weight: 600;
        }
      `}</style>

      <div className="relative flex justify-center">
        <div className="card">
          <div className="imgBx">
            <img
              src={profile?.photo || "/default-avatar.png"}
              alt={profile?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="details">
            <h2 className="text-2xl font-bold">
              {profile?.name}
            </h2>
            <p className="text-blue-400 text-lg mt-2">{profile?.issuesSolved} issues solved</p>
            {/* 
            <div className="mt-10 text-gray-400 font-medium">Languages</div>
            <div className="interests">
              {profile?.languages?.map((language, i) => (
                <div key={i} className="interest-item">
                  {language}
                </div>
              ))}
            </div> */}
          </div>

          <div className="likes">
            <img src="/coin.png" alt="coin" />
            <span className="likes-count">{profile?.points}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
