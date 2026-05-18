import Widget from '../Widget';
import usePageTitle from '../../hooks/usePageTitle';
import { IconBrandGithub, IconBrandLinkedin, IconMail, IconUser } from '@tabler/icons-react';

const DEVELOPER_INFO = {
  name: 'Your Name',
  role: 'Full Stack Developer',
  bio: 'Passionate about building beautiful and functional web experiences. I specialize in modern JavaScript frameworks and cloud technologies. Always learning, always improving.',
  initials: 'YN',
  avatarBg: 'linear-gradient(135deg, #1a6ef5 0%, #9050d0 100%)',
  social: [
    {
      Icon: IconBrandGithub,
      label: 'GitHub',
      url: 'https://github.com',
      color: '#1a3870',
    },
    {
      Icon: IconBrandLinkedin,
      label: 'LinkedIn',
      url: 'https://linkedin.com',
      color: '#0A66C2',
    },
    {
      Icon: IconMail,
      label: 'Email',
      url: 'mailto:hello@example.com',
      color: '#EA4335',
    },
  ],
};

export default function AboutWidget() {
  usePageTitle('about', 'About');

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Widget
      id="about"
      title="About Me"
      icon={IconUser}
      iconBg="#1a6ef5"
      defaultPosition={{ x: 50, y: 50 }}
      width={350}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar Circle */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{
            background: DEVELOPER_INFO.avatarBg,
            boxShadow: '0 8px 16px rgba(26, 110, 245, 0.2)',
          }}
        >
          {DEVELOPER_INFO.initials}
        </div>

        {/* Developer Name */}
        <div className="text-center">
          <h2
            className="font-bold"
            style={{
              fontSize: '18px',
              color: '#1a3870',
              margin: 0,
            }}
          >
            {DEVELOPER_INFO.name}
          </h2>

          {/* Role/Title */}
          <p
            className="mt-1"
            style={{
              fontSize: '13px',
              color: '#6b92b8',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {DEVELOPER_INFO.role}
          </p>
        </div>

        {/* Bio */}
        <p
          className="text-center leading-relaxed"
          style={{
            fontSize: '12px',
            color: '#4a5f7f',
            lineHeight: '1.6',
          }}
        >
          {DEVELOPER_INFO.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {DEVELOPER_INFO.social.map((social, idx) => (
            <button
              key={idx}
              onClick={() => handleSocialClick(social.url)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                color: social.color,
              }}
              title={social.label}
            >
              <social.Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </Widget>
  );
}
