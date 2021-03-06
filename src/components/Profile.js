import React from "react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { Line } from "react-chartjs-2";
import moment from "moment";
import Spinner from "./Spinner";
import Achievements from "./Achievements";
import Challenges from "./Challenges";

const Profile = () => {
  const history = useHistory();
  const user = useSelector((state) => state.user.user);
  const [profile, setProfile] = React.useState();
  const [weekStyle, setWeekStyle] = React.useState(false);
  const [monthStyle, setMonthStyle] = React.useState(true);
  const [yearStyle, setYearStyle] = React.useState(false);
  const findMinutes = (daysAgoStart, daysAgoLimit) => {
    let minutes = 0;
    if (profile !== undefined) {
      profile.posts
        .filter((post) => {
          return (
            daysAgoLimit > (new Date() - new Date(post.date)) / 86400000 &&
            (new Date() - new Date(post.date)) / 86400000 > daysAgoStart
          );
        })
        .forEach((post) => (minutes = minutes + post.time / 60));
    }
    return minutes;
  };
  React.useEffect(() => {
    if (user === null) {
      history.push("/login");
    }
  });
  const abbreviateNumber = function (num, fixed) {
    if (num === null) {
      return null;
    } // terminate early
    if (num === 0) {
      return "0";
    } // terminate early
    fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
    var b = num.toPrecision(2).split("e"), // get power
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
      c =
        k < 1
          ? num.toFixed(0 + fixed)
          : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
      d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
      e = d + ["", "K", "M", "B", "T"][k]; // append power
    return e;
  };
  const weekData = {
    labels: [
      moment().subtract(6, "days").format("MMM Do"),
      moment().subtract(5, "days").format("MMM Do"),
      moment().subtract(4, "days").format("MMM Do"),
      moment().subtract(3, "days").format("MMM Do"),
      moment().subtract(2, "days").format("MMM Do"),
      moment().subtract(1, "days").format("MMM Do"),
      moment().format("MMM Do"),
    ],
    datasets: [
      {
        label: "Mindful Minutes",
        data: [
          findMinutes(6, 7),
          findMinutes(5, 6),
          findMinutes(4, 5),
          findMinutes(3, 4),
          findMinutes(2, 3),
          findMinutes(1, 2),
          findMinutes(0, 1),
        ],
        backgroundColor: "#d9d4e777",
        borderColor: "#a786df",
        borderWidth: 1,
        fill: "start",
      },
    ],
  };
  const monthData = {
    labels: [
      moment().subtract(25, "days").format("MMM Do"),
      moment().subtract(20, "days").format("MMM Do"),
      moment().subtract(15, "days").format("MMM Do"),
      moment().subtract(10, "days").format("MMM Do"),
      moment().subtract(5, "days").format("MMM Do"),
      moment().format("MMM Do"),
    ],
    datasets: [
      {
        label: "Mindful Minutes",
        data: [
          findMinutes(25, 30),
          findMinutes(20, 25),
          findMinutes(15, 20),
          findMinutes(10, 15),
          findMinutes(5, 10),
          findMinutes(0, 5),
        ],
        backgroundColor: "#d9d4e777",
        borderColor: "#a786df",
        borderWidth: 1,
        fill: "start",
      },
    ],
  };
  const yearData = {
    labels: [
      moment().subtract(305, "days").format("MMM YY"),
      moment().subtract(244, "days").format("MMM YY"),
      moment().subtract(183, "days").format("MMM YY"),
      moment().subtract(122, "days").format("MMM YY"),
      moment().subtract(61, "days").format("MMM YY"),
      moment().format("MMM YY"),
    ],
    datasets: [
      {
        label: "Mindful Minutes",
        data: [
          findMinutes(305, 365),
          findMinutes(244, 305),
          findMinutes(183, 244),
          findMinutes(122, 183),
          findMinutes(61, 122),
          findMinutes(0, 61),
        ],
        backgroundColor: "#d9d4e777",
        borderColor: "#a786df",
        borderWidth: 1,
        fill: "start",
      },
    ],
  };

  const [data, setData] = React.useState(monthData);
  let profileId = useParams()._id;
  if (profileId === undefined) {
    // eslint-disable-next-line
    profileId = user._id;
  }
  React.useEffect(() => {
    fetch(`/profile/${profileId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          posts: data.posts,
          user: data.user,
          achievements: data.achievements,
        });
      });
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    setData(monthData);
    // eslint-disable-next-line
  }, [profile]);
  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          ticks: {
            callback: function (value, index, values) {
              if (index % 2 === 0) {
                return value;
              }
            },
          },
        },
      ],
    },
  };

  return (
    <Main>
      <Banner>
        <span>Profile</span>
      </Banner>
      <Wrapper>
        {profile === undefined ? (
          <Spinner />
        ) : (
          <>
            <Avatar src={profile.user.avatarSrc} alt={profile.user.name} />
            <Name>{profile.user.name}</Name>
            <Stats>
              <Stat>
                <h3>{abbreviateNumber(profile.user.totalMinutes)}</h3>
                <p>Mindful Minutes</p>
              </Stat>
              <Stat>
                <h3>{profile.user.totalSessions}</h3>
                <p>Total Sessions</p>
              </Stat>
            </Stats>
            <ChartType>
              <button
                className={weekStyle === true && "active"}
                onClick={() => {
                  setData(weekData);
                  setWeekStyle(true);
                  setMonthStyle(false);
                  setYearStyle(false);
                }}
              >
                Week
              </button>
              <button
                className={monthStyle === true && "active"}
                onClick={() => {
                  setData(monthData);
                  setWeekStyle(false);
                  setMonthStyle(true);
                  setYearStyle(false);
                }}
              >
                Month
              </button>
              <button
                className={yearStyle === true && "active"}
                onClick={() => {
                  setData(yearData);
                  setWeekStyle(false);
                  setMonthStyle(false);
                  setYearStyle(true);
                }}
              >
                Year
              </button>
            </ChartType>
            <div style={{ padding: "10px" }}>
              <Line data={data} options={options} />
            </div>
            <Achievements achievements={profile.achievements} />
            <Challenges
              challenges={profile.user.challenges}
              _id={profileId}
              profile={profile}
              setProfile={setProfile}
              currentUser={user}
            />
          </>
        )}
      </Wrapper>
      <Navbar />
    </Main>
  );
};
const Main = styled.div`
  height: 100%;
  overflow: scroll;
  scroll-behavior: smooth;
`;
const ChartType = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    background-color: white;
    font-size: large;
    border: 2px solid #eee;
    padding: 6px 30px 0 30px;
    border-bottom: none;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    outline: none;
    cursor: pointer;
    &.active {
      background-color: #a786df;
      color: white;
    }
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 {
    font-size: x-large;
    margin-bottom: 4px;
  }
`;
const Stats = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
const Name = styled.p`
  position: absolute;
  top: 10px;
  left: 154px;
  font-size: x-large;
`;
const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -50px;
  margin-left: 40px;
`;
const Wrapper = styled.div`
  position: sticky;
  top: 60px;
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.5);
  margin-top: 140px;
  background-color: #f9f8fc;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  width: 100%;
  min-height: 100%;
`;
const Banner = styled.div`
  span {
    color: white;
    font-size: xx-large;
    margin-top: 12px;
  }
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  height: 170px;
  width: 100%;
  background: linear-gradient(to right, #fec7d7, #a786df);
`;

export default Profile;
