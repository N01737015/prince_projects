import Layout from '../components/Layout';

const members = [
  {
    name: 'Udit Desai',
    id: 'N01762272',
    role: 'Group Lead 1',
    contributions: [
      'Group coordination and follow-up with team members',
      'Backend architecture design',
      'Integration support and testing',
      'Documentation and report preparation'
    ]
  },
  {
    name: 'Prince Patel',
    id: 'N01737015',
    role: 'Group Lead 2',
    contributions: [
      'GitHub repository management and version control',
      'Branching strategy and code merging',
      'Backend integration support',
      'Testing and deployment preparation'
    ]
  },
  {
    name: 'Sachita Ghoora',
    id: 'N01682768',
    role: 'Backend Developer',
    contributions: [
      'Product and category module development',
      'Product model design and API implementation',
      'Business rule validation for product management'
    ]
  },
  {
    name: 'Newvika Patel',
    id: 'N01736248',
    role: 'Backend Developer',
    contributions: [
      'Cart and order module development',
      'Order tracking workflow implementation',
      'Server-side calculations and order processing logic'
    ]
  },
  {
    name: 'Bibi Narisa Alleyne',
    id: 'N01751917',
    role: 'Frontend Developer',
    contributions: [
      'Recommendation system logic and testing',
      'Documentation support and report formatting',
      'UI design and frontend development'
    ]
  }
];

const AboutTeamPage = () => {
  return (
    <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
      <div className="container page-section">
        <div className="about-header">
          <h2 className="page-title">About Our Team</h2>
          <p className="about-subtitle">
            Maple Electronics is a course project for CPAN 212 - Modern Web Technologies at Humber Polytechnic.
            The system is a full-stack multi-vendor electronics marketplace built with Node.js, Express, MongoDB,
            Keycloak, and React.
          </p>
        </div>

        <div className="about-project">
          <h3>Project Overview</h3>
          <p>
            Maple Electronics simulates an Amazon-style marketplace where vendors sell electronics to customers
            under admin supervision. The platform features JWT-based authentication via Keycloak, role-based
            access control for Admin, Vendor, and Customer roles, product lifecycle management, shopping cart,
            order tracking, and a microservices backend architecture.
          </p>
          <div className="tech-stack">
            <span className="tech-pill">Node.js</span>
            <span className="tech-pill">Express.js</span>
            <span className="tech-pill">MongoDB</span>
            <span className="tech-pill">Mongoose</span>
            <span className="tech-pill">Keycloak</span>
            <span className="tech-pill">JWT</span>
            <span className="tech-pill">React</span>
            <span className="tech-pill">Vite</span>
            <span className="tech-pill">Docker</span>
            <span className="tech-pill">Nginx</span>
          </div>
        </div>

        <h3 style={{ marginBottom: '28px', fontSize: '24px', color: '#171833' }}>Team Members</h3>

        <div className="team-grid">
          {members.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">{member.name.split(' ').map((n) => n[0]).join('')}</div>
              <div className="team-info">
                <h4>{member.name}</h4>
                <p className="team-id">{member.id}</p>
                <p className="team-role">{member.role}</p>
                <ul className="team-contributions">
                  {member.contributions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="about-project" style={{ marginTop: '40px' }}>
          <h3>Course Information</h3>
          <p><strong>Course:</strong> CPAN 212 - Modern Web Technologies</p>
          <p><strong>Institution:</strong> Humber Polytechnic, Faculty of Applied Sciences and Technology</p>
          <p><strong>Instructor:</strong> Vitalii Bohudskyi</p>
          <p><strong>Term:</strong> Winter 2026</p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutTeamPage;
