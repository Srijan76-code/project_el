import React from 'react'

const profileCard = () => {
  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;500&family=Ysabeau+Office:wght@400;500&display=swap');
      @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

      :root {
        --dark-color: hsl(180, 5%, 8%);
        --dark-color-light: hsl(0, 0%, 100%);
        --first-color: #9d4edd;
        --text-color: hsl(0, 0%, 100%);
        --body-color: hsl(29, 100%, 99%);
        --body-font: 'Tektur', cursive;
        --h3-font-size: 1.5rem;
        --smaller-font-size: .90rem;
      }

      .profile-card-wrapper {
        display: inline-block;
        position: relative;
        margin-top: -70px;
      }

      img {
        max-width: 100%;
        height: auto;
      }

      .card {
        position: relative;
        width: 350px;
        height: 510px; /* always expanded */
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        box-shadow: 0 35px 80px rgba(0, 0, 0, 0.15), 0 -20px 80px -20px #ff7aa42f inset;
        transition: 0.5s;
        transform-origin: top center;
      }

      .imgBx {
        position: absolute;
        left: 50%;
        top: -50px;
        transform: translateX(-50%);
        width: 250px;  /* always large */
        height: 250px; /* always large */
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.50);
        overflow: hidden;
        transition: 0.5s;
      }

      .imgBx img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .card .content {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        overflow: hidden;
        padding-top: 180px;
      }

      .card .content .details {
        padding: 40px;
        text-align: center;
        width: 100%;
        transform: translateY(0px); /* always visible */
        transition: 0.5s;
      }

      .card .content .details h2 {
        font-size: 1.25em;
        font-weight: 600;
        color: var(--dark-color-light);
        line-height: 1.2em;
      }

      .card .content .details h2 span {
        font-size: 0.75em;
        font-weight: 500;
  color:rgb(140, 146, 157);
      }

      .card .content .details .data {
        display: flex;
        justify-content: space-between;
        margin: 20px 10px;
      }

      .card .content .details .data h3 {
        font-size: 1em;
        color: white;
        line-height: 1.2em;
        font-weight: 600;
      }

      .card .content .details .data h3 span {
        font-size: 0.85em;
        font-weight: 400;
  color:rgb(140, 146, 157);

      }

        .text_interets {
  color:rgb(140, 146, 157);
  font-weight: 400; /* Tailwind's gray-400 */
}


      .interests {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        margin-top: 15px;
      }

      .interest-item {
        padding: 6px 12px;
        font-size: 0.8em;
        color: white;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        font-weight: 500;
      }

      .likes {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  top: 480px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 100px;

  /* Strong frosted blur effect */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);

  border: 1px solid rgb(26, 26, 26);
  border-radius: 40px;

  z-index: 10;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}


      .like-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }

      .likes-count {
        font-size: 1em;
        font-weight: 600;
        color: white;
      }
      `}</style>

      <div className="profile-card-wrapper">
        <div className="card">
          <div className="imgBx">
            <img src={`${profile.user?.profile?.photos[0].url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/')}`} alt={`${profile.user?.name || profile.name} profile`} />
          </div>

          <div className="content">
            <div className="details">
              <h2 className="name">
                {profile.user?.name || profile.name}<br />
                <span className="year">{formatYear(profile.user?.year || profile.year)}</span>
              </h2>
              <div className="data">
                <h3 className="course">{formatProgramme(profile.user?.programme || profile.course)}<br /><span>Course</span></h3>
                <h3 className="zodiac">{profile.user?.profile?.zodiac_sign || profile.zodiac}<br /><span>Zodiac</span></h3>
              </div>

              <div className="text_interets">Interests</div>
              <div className="interests">
                {(profile.user?.profile?.interest || profile.interests)?.map((interest, index) => (
                  <div key={index} className="interest-item">{interest}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="likes">
          <img src="/wantedPhotos/image.png" alt="Like" className="like-icon" />
          <span className="likes-count">{profile.likes}</span>
        </div>
      </div>
    </>
  )
}

export default profileCard