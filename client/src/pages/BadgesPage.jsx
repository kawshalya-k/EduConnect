import React, { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Tabs,
  Card,
  Progress,
  Avatar,
  Button,
  Typography,
  Row,
  Col,
  Tag
} from "antd";
import {
  BellOutlined,
  UserOutlined,
  ThunderboltFilled,
  TrophyFilled,
  RocketFilled,
  LockOutlined,
  CheckCircleFilled,
  DollarCircleFilled,
  StarFilled,
  TeamOutlined,
  CrownOutlined
} from "@ant-design/icons";
import "./BadgesPage.css";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function BadgeCard({ badge }) {
  const isLocked = badge.state === "locked";
  const isHidden = badge.variant === "hidden";

  return (
    <Card
      className={[
        "badgeCard",
        isLocked ? "isLocked" : "",
        isHidden ? "isHidden" : ""
      ].join(" ")}
      bordered={false}
    >
      {!isHidden && (
        <div className="badgeTopRight">
          {isLocked ? (
            <span className="badgeTopRightIcon lock">
              <LockOutlined />
            </span>
          ) : (
            <span className="badgeTopRightIcon ok">
              <CheckCircleFilled />
            </span>
          )}
        </div>
      )}

      {!isHidden && (
        <div className="badgeIconWrap">
          <div className="badgeIconCircle">{badge.icon}</div>
        </div>
      )}

      {!isHidden && (
        <>
          <Title level={5} className="badgeTitle">
            {badge.title}
          </Title>

          <Text className="badgeDesc">{badge.description}</Text>

          <div className="badgeMetaRow">
            <Text className={["badgeState", isLocked ? "muted" : ""].join(" ")}>
              {badge.stateLabel}
            </Text>
            <Text className={["badgePct", isLocked ? "muted" : ""].join(" ")}>
              {badge.percent}%
            </Text>
          </div>

          <Progress
            percent={badge.percent}
            showInfo={false}
            strokeColor={isLocked ? "rgba(22, 119, 255, 0.0)" : "var(--green)"}
            trailColor={
              isLocked
                ? "rgba(17, 24, 39, 0.08)"
                : "rgba(16, 185, 129, 0.12)"
            }
            className="badgeProgress"
          />

          {badge.subNote ? <Text className="badgeSubNote">{badge.subNote}</Text> : null}
        </>
      )}

      {isHidden && (
        <div className="hiddenBody">
          <div className="hiddenDot" />
          <Title level={5} className="hiddenTitle">
            Hidden Badge
          </Title>
          <Text className="hiddenDesc">
            Keep exploring to discover the requirements for this mysterious
            achievement.
          </Text>
        </div>
      )}
    </Card>
  );
}

export default function BadgesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [mode, setMode] = useState("learner");

  const stats = { badges: "12/25", xp: "1,250" };

  const allBadges = useMemo(
    () => [
      {
        key: "first-session",
        title: "First Session",
        description: "Completed your very first learning session on EduConnect.",
        icon: <RocketFilled style={{ color: "var(--green)" }} />,
        state: "completed",
        stateLabel: "Completed",
        percent: 100
      },
      {
        key: "fast-learner",
        title: "Fast Learner",
        description: "Finished a full course module in under 24 hours.",
        icon: <ThunderboltFilled style={{ color: "var(--green)" }} />,
        state: "completed",
        stateLabel: "Completed",
        percent: 100
      },
      {
        key: "top-student",
        title: "Top Student",
        description: "Reached the #1 spot on the weekly leaderboard.",
        icon: <TrophyFilled style={{ color: "var(--green)" }} />,
        state: "completed",
        stateLabel: "Completed",
        percent: 100
      },
      {
        key: "streak",
        title: "7-Day Streak",
        description: "Study for 7 consecutive days to earn this badge.",
        icon: <StarFilled style={{ color: "rgba(17,24,39,0.45)" }} />,
        state: "inprogress",
        stateLabel: "5 / 7 Days",
        percent: 71
      },
      {
        key: "collaborator",
        title: "Collaborator",
        description: "Contribute to 5 community discussions or Q&As.",
        icon: <TeamOutlined style={{ color: "rgba(17,24,39,0.35)" }} />,
        state: "locked",
        stateLabel: "1 / 5 contributions",
        percent: 20
      },
      {
        key: "course-master",
        title: "Course Master",
        description: "Complete 10 full courses with an average score of 90%.",
        icon: <CrownOutlined style={{ color: "rgba(17,24,39,0.25)" }} />,
        state: "locked",
        stateLabel: "Locked",
        percent: 0
      },
      {
        key: "olympian",
        title: "Olympian",
        description: "Earn all 3 gold medals in the monthly championship.",
        icon: <TrophyFilled style={{ color: "rgba(17,24,39,0.20)" }} />,
        state: "locked",
        stateLabel: "Locked",
        percent: 0
      },
      {
        key: "hidden",
        variant: "hidden",
        state: "hidden",
        percent: 0
      }
    ],
    []
  );

  const filtered = useMemo(() => {
    if (activeTab === "all") return allBadges;
    if (activeTab === "earned") return allBadges.filter((b) => b.state === "completed");
    if (activeTab === "inprogress") return allBadges.filter((b) => b.state === "inprogress");
    if (activeTab === "locked") return allBadges.filter((b) => b.state === "locked");
    return allBadges;
  }, [activeTab, allBadges]);

  return (
    <Layout className="pageShell">
      <Header className="topNav">
        <div className="navLeft">
          <div className="brand">
            <div className="brandMark">🎓</div>
            <div className="brandName">EduConnect</div>
          </div>

          <Menu
            mode="horizontal"
            className="navMenu"
            selectable
            defaultSelectedKeys={["dashboard"]}
            items={[
              { key: "dashboard", label: "Dashboard" },
              { key: "sessions", label: "Sessions" },
              { key: "messages", label: "Messages" }
            ]}
          />
        </div>

        <div className="navRight">
          <div className="modePill">
            <button
              className={["pillBtn", mode === "mentor" ? "active" : ""].join(" ")}
              onClick={() => setMode("mentor")}
              type="button"
            >
              Mentor
            </button>
            <button
              className={["pillBtn", mode === "learner" ? "active" : ""].join(" ")}
              onClick={() => setMode("learner")}
              type="button"
            >
              Learner Mode
            </button>
          </div>

          <Button className="coinsBtn" icon={<DollarCircleFilled />}>
            <strong>100</strong>&nbsp;Skill Coins
          </Button>

          <Button className="iconBtn" icon={<BellOutlined />} />
          <Avatar size={34} icon={<UserOutlined />} />
        </div>
      </Header>

      <Content className="contentArea">
        <div className="container">
          <Breadcrumb
            className="crumb"
            items={[{ title: "Dashboard" }, { title: <strong>My Badges</strong> }]}
          />

          <div className="titleRow">
            <div>
              <Title className="pageTitle">Badges & Achievements</Title>
              <Text className="pageSubtitle">
                Track your learning journey, unlock unique milestones, and
                showcase your expertise to the community.
              </Text>
            </div>

            <div className="stats">
              <Card className="statCard" bordered={false}>
                <Text className="statLabel">BADGES</Text>
                <div className="statValue">{stats.badges}</div>
              </Card>
              <Card className="statCard" bordered={false}>
                <Text className="statLabel">XP POINTS</Text>
                <div className="statValue">{stats.xp}</div>
              </Card>
            </div>
          </div>

          <Tabs
            className="tabs"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "all", label: "All Badges" },
              { key: "earned", label: "Earned (12)" },
              { key: "inprogress", label: "In Progress (4)" },
              { key: "locked", label: "Locked (9)" }
            ]}
          />

          <Row gutter={[16, 16]}>
            {filtered.map((b) => (
              <Col key={b.key} xs={24} sm={12} lg={6}>
                <BadgeCard badge={b} />
              </Col>
            ))}
          </Row>

          <Card className="milestoneCard" bordered={false}>
            <div className="milestoneInner">
              <div className="milestoneIconBox">
                <StarFilled style={{ color: "var(--green)", fontSize: 26 }} />
              </div>

              <div className="milestoneBody">
                <div className="milestoneTop">
                  <Tag className="milestoneTag">NEXT MILESTONE</Tag>
                  <Title level={4} className="milestoneTitle">
                    Master Scholar
                  </Title>
                </div>

                <Text className="milestoneDesc">
                  You&apos;re only 250 XP away from achieving the Master Scholar
                  rank! This will unlock exclusive advanced workshops and a
                  profile spotlight.
                </Text>

                <div className="milestoneProgressRow">
                  <Text className="milestoneXpText">
                    <strong>1,250</strong> / 1,500 XP
                  </Text>
                  <Text className="milestonePct">83%</Text>
                </div>

                <Progress
                  percent={83}
                  showInfo={false}
                  strokeColor="var(--green)"
                  trailColor="rgba(16, 185, 129, 0.14)"
                  className="milestoneProgress"
                />
              </div>
            </div>
          </Card>
        </div>
      </Content>

      <Footer className="siteFooter">
        <div className="footerContainer">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <div className="footerBrand">
                <div className="footerBrandName">EduConnect</div>
                <Text className="footerText">
                  Empowering University students through peer-to-peer learning
                  and community recognition.
                </Text>

                <div className="footerSocial">
                  <Button className="footerIconBtn" shape="circle" />
                  <Button className="footerIconBtn" shape="circle" />
                  <Button className="footerIconBtn" shape="circle" />
                </div>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div className="footerColTitle">Student Center</div>
              <a className="footerLink" href="#">Student Registration</a>
              <a className="footerLink" href="#">Search Mentors</a>
              <a className="footerLink" href="#">Skill Marketplace</a>
            </Col>

            <Col xs={24} md={6}>
              <div className="footerColTitle">Mentorship</div>
              <a className="footerLink" href="#">Mentor Onboarding</a>
              <a className="footerLink" href="#">Verification Center</a>
              <a className="footerLink" href="#">Teaching Tools</a>
              <a className="footerLink" href="#">Mentor Guidelines</a>
            </Col>

            <Col xs={24} md={6}>
              <div className="footerColTitle">Portal</div>
              <a className="footerLink" href="#">About Us</a>
              <a className="footerLink" href="#">Privacy Policy</a>
              <a className="footerLink" href="#">Terms of Service</a>
              <a className="footerLink" href="#">Community Guidelines</a>
              <a className="footerLink" href="#">Contact Support</a>
              <a className="footerLink" href="#">Help Center</a>
            </Col>
          </Row>

          <div className="footerBottom">
            <div className="footerDivider" />
            <Text className="footerCopyright">
              © 2026 EduConnect. All rights reserved.
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}