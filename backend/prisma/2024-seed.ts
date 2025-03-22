import {
  CommitteeLevel,
  CommitteeRole,
  PrismaClient,
  Profile,
  UserLevel,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const edition2024 = await prisma.eventEdition.create({
    data: {
      name: 'WEPGCOMP 2024',
      description:
        'Um evento para estudantes de doutorado apresentarem suas pesquisas.',
      callForPapersText: 'Envie seus artigos para avaliação e apresentação.',
      partnersText:
        '<b>Apoiado por:</b><br>Instituto qualquercoisa<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="black"/><rect x="6" y="6" width="12" height="12" fill="white"/></svg>',
      location: 'UFBA, Salvador, Bahia, Brasil',
      startDate: new Date('2024-11-12'),
      endDate: new Date('2024-11-14'),
      submissionStartDate: new Date('2024-01-01'),
      submissionDeadline: new Date('2024-11-08'),
      isActive: true,
      isEvaluationRestrictToLoggedUsers: true,
      presentationDuration: 15,
      presentationsPerPresentationBlock: 3,
    },
  });

  // const rooms = await prisma.room.createManyAndReturn({
  //   data: [
  //     {
  //       eventEditionId: edition2024.id,
  //       name: 'Sala A',
  //       description: 'Sala A',
  //     },
  //     {
  //       eventEditionId: edition2024.id,
  //       name: 'Sala B',
  //       description: 'Sala B',
  //     },
  //   ],
  // });

  const comiteeMembers = [
    {
      name: 'Bruno Pereira dos Santos',
      email: 'bruno.pereira@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Rafael Augusto de Melo',
      email: 'rafael.melo@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Robespierre Dantas da Rocha Pita',
      email: 'robespierre.dantas@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Rodrigo Rocha Gomes e Souza',
      email: 'rodrigo.rocha@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Bianco Oliveira',
      email: 'bianco.oliveira@ufba.br',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Admin,
      isVerified: true,
    },
    {
      name: 'Bruno Morais',
      email: 'bruno.morais@ufba.br',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Admin,
      isVerified: true,
    },
  ];

  const comiteeUsers = await prisma.userAccount.createManyAndReturn({
    data: comiteeMembers.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    })),
  });

  const committeeMembersData = comiteeUsers.map((user, index) => ({
    eventEditionId: edition2024.id,
    userId: user.id,
    level: index < 4 ? CommitteeLevel.Coordinator : CommitteeLevel.Committee,
    role:
      index < 4 ? CommitteeRole.OrganizingCommittee : CommitteeRole.ITSupport,
  }));

  await prisma.committeeMember.createMany({
    data: committeeMembersData,
  });

  const professors = [
    'Antonio Lopes Apolinario Junior',
    'Manoel Gomes de Mendonça Neto',
    'Eduardo Santana de Almeida',
    'Marcos Ennes Barreto',
    'Rita Suzana Pitangueira Maciel',
    'Laís do Nascimento Salvador',
    'Ivan do Carmo Machado',
    'Daniela Barreiro Claro',
    'Gustavo Bittencourt Figueiredo',
    'Frederico Araújo Durão',
    'Leobino Nascimento Sampaio',
    'Vaninha Vieira dos Santos',
    'Cássio Vinicius Serafim Prazeres',
    'Maycon Leone Maciel Peixoto',
    'Christina Von Flach Garcia Chavez',
    'Ricardo Araújo Rios',
    'George Marconi de Araújo Lima',
    'Ecivaldo de Souza Matos',
    'Gecynalda Soares da Silva Gomes',
  ].map((name) => {
    const emailName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(' ')
      .slice(0, 2)
      .join('.');
    return {
      name,
      email: `${emailName}@ufba.br`,
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Default,
      isVerified: true,
    };
  });

  await prisma.userAccount.createMany({
    data: professors.map((professor) => ({
      ...professor,
      password: bcrypt.hashSync(professor.password, 10),
    })),
  });

  const panelistsAndPresentations = [
    {
      name: 'Rafaela Souza Alcântara',
      presentation:
        'Redução de Artefatos Metálicos em Tomografias Odontológicas Utilizando Processamento Espectral',
      professor: 'Antonio Lopes Apolinario Junior',
      topic: 'CA: Computação Visual (CVIS)',
    },
    {
      name: 'Carlos Frederico Jansen Muakad',
      presentation:
        'Catalogação de fontes de literatura cinza em engenharia de software',
      professor: 'Manoel Gomes de Mendonça Neto',
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Lucas Amparo Barbosa',
      presentation: '',
      professor: 'Antonio Lopes Apolinario Junior',
      topic: 'CA: Computação Visual (CVIS)',
    },
    {
      name: 'Roselane Silva Farias',
      presentation:
        'The Neuroscience of Testing: Enhancing Quality Assurance Through Cognitive Insights',
      professor: 'Eduardo Santana de Almeida',
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Tiago Fernandes Machado',
      presentation:
        'Análise de classificação multi-label nos desfechos da doença falciforme',
      professor: 'Marcos Ennes Barreto',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Jenifer Vieira Toledo Tavares',
      presentation:
        'A Guide to Evaluating and Customizing Software Development Processes Using Hybrid Methods Based on Scrum',
      professor: 'Rita Suzana Pitangueira Maciel',
      topic: 'ESS: Evolução de Software',
    },
    {
      name: 'João Alberto Castelo Branco Oliveira',
      presentation:
        'Enhancing Explainable Recommender Systems through Automated Ontology Population and Data Provenance Assurance',
      professor: 'Laís do Nascimento Salvador',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Joselito Mota Júnior',
      presentation:
        'A comprehensive study of issue labeling in GitHub repositories',
      professor: 'Ivan do Carmo Machado',
      topic: 'ESS: Medição, Mineração e Visualização de Software',
    },
    {
      name: 'Larrissa Dantas Xavier da Silva',
      presentation: '',
      professor: 'Daniela Barreiro Claro',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Eonassis Oliveira Santos',
      presentation:
        'Cascading-Failure Disaster Recovery based on Time Varying Graph in EONs',
      professor: 'Gustavo Bittencourt Figueiredo',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Diego Correa da Silva',
      presentation:
        'Exploiting Calibration as a Multi-Objective Recommender System',
      professor: 'Frederico Araújo Durão',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Andre Luiz Romano Madureira',
      presentation: 'Otimizando Comunicações NDN  em redes MANET',
      professor: 'Leobino Nascimento Sampaio',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Maria Clara Pestana Sartori',
      presentation:
        'United for humanity: developing a collaborative model based on crowdsourcing to engage volunteers in crisis recovery campaigns',
      professor: 'Vaninha Vieira dos Santos',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Adriana Viriato Ribeiro',
      presentation:
        'Serviços de Saúde Avançados: Conectividade e Segurança em Sistemas de Vida Assistida',
      professor: 'Leobino Nascimento Sampaio',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'George Pacheco Pinto',
      presentation: 'FoT-PDS: Towards Data Privacy in a Fog of Things',
      professor: 'Cássio Vinicius Serafim Prazeres',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Lidiany Cerqueira Santos',
      presentation:
        'Exploring Empathy in Software Engineering Based on the Practitioners’ Perspective',
      professor: 'Manoel Gomes de Mendonça Neto',
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Beatriz Silva de Santana',
      presentation:
        'Modelo de recomendações para melhoria da segurança psicológica no desenvolvimento de software',
      professor: 'Manoel Gomes de Mendonça Neto',
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Elivelton Oliveira Rangel',
      presentation:
        'A Data-Driven Approach to Assess Emergency Response in Urban Areas based on Historical Ambulance Calls',
      professor: 'Maycon Leone Maciel Peixoto',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Ricardo Eugênio Porto Vieira',
      presentation:
        'Perceived Diversity in Software Engineering:  An Update and Extended Systematic Literature Review',
      professor: 'Manoel Gomes de Mendonça Neto',
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Marcos Vinicius Bião Cerqueira',
      presentation:
        'Sistema de recomendação de recursos educacionais baseados em competência',
      professor: 'Laís do Nascimento Salvador',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Cleberton Carvalho Soares',
      presentation:
        'Maturity level of software systems to comply with the General  Data Protection Law (LGPD)',
      professor: 'Rita Suzana Pitangueira Maciel',
      topic: 'ESS: Qualidade de Software',
    },
    {
      name: 'Alexsandre Emanoel Gonçalves',
      presentation:
        'Mecanismos para Offloading de Dados em Redes 5G Heterogêneas',
      professor: 'Gustavo Bittencourt Figueiredo',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Tássio Guerreiro Antunes Virgínio',
      presentation:
        'Dispersion of Test Smells in mobile projects using the Flutter framework',
      professor: 'Ivan do Carmo Machado',
      topic: 'ESS: Qualidade de Software',
    },
    {
      name: 'Mirlei Moura da Silva',
      presentation:
        'Mixed Data Mining: a study focused on numerical and time series data.',
      professor: 'Robespierre Dantas da Rocha Pita',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Beatriz Brito do Rêgo',
      presentation:
        'Formação de Profissionais de Computação para Ciência Aberta',
      professor: 'Christina Von Flach Garcia Chavez',
      topic: 'ESS: Educação em Engenharia de Software.',
    },
    {
      name: 'Leandro Santos da Cruz',
      presentation:
        'Um Framework para Implementação Eficaz do Ensino Baseado em Competências no Ensino Superior de Computação.',
      professor: 'Laís do Nascimento Salvador',
      topic: '',
    },
    {
      name: 'Railana Santana Lago',
      presentation: 'Towards Automated Refactoring of Smelly Test Code',
      professor: 'Ivan do Carmo Machado',
      topic: 'ESS: Qualidade de Software',
    },
    {
      name: 'Brenno de Mello Alencar',
      presentation:
        'Concept Drift on Delayed Partially Labeled Data Streamslmente rotulados',
      professor: 'Ricardo Araújo Rios',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Mateus Carvalho da Silva',
      presentation:
        'Abordagens de programação inteira mista para consolidação de frete com frota heterogênea terceirizada, frete morto e custos de múltiplas entrega',
      professor: 'Rafael Augusto de Melo',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Mayka de Souza Lima',
      presentation:
        'A Conceptual Framework for the Design of Virtual Learning Environments',
      professor: 'Rita Suzana Pitangueira Maciel',
      topic: 'ESS: Educação em Engenharia de Software.',
    },
    {
      name: 'Marcos Vinícois dos Santos Ferreira',
      presentation: 'Fuzzifying Chaos in Dynamical Systems',
      professor: 'Ricardo Araújo Rios',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Antonio Carlos Marcelino de Paula',
      presentation:
        'Burnout in Software Projects: An Analysis of Stack Exchange Discussions',
      professor: 'Manoel Gomes de Mendonca Neto',
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Allan Sérgio Gonçalves Alves',
      presentation: '',
      professor: 'George Marconi de Araújo Lima',
      topic: 'SC: Sistemas Embarcados e de Tempo Real (SETR)',
    },
    {
      name: 'Edeyson Andrade Gomes',
      presentation:
        'Uma abordagem baseada em ontologia para auxiliar a aplicação de princípios curriculares orientados a competências em recursos educacionais abertos.',
      professor: 'Laís do Nascimento Salvador',
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Jamile de Barros Vasconcelos',
      presentation:
        'Avaliação segura de amostras em análise temporal baseada em medições para projetos de sistemas de tempo real',
      professor: 'George Marconi de Araújo Lima',
      topic: 'SC: Sistemas Embarcados e de Tempo Real (SETR)',
    },
    {
      name: 'Moara Sousa Brito Lessa',
      presentation:
        'Aplicação da aprendizagem baseada em projetos no ensino de ES: uma investigação no contexto da educação baseada em competências',
      professor: 'Laís do Nascimento Salvador',
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Tadeu Nogueira Costa de Andrade',
      presentation:
        'Métodos estatísticos e de inteligência computacional para análise temporal em sistemas de tempo real',
      professor: 'George Marconi de Araújo Lima',
      topic: 'SC: Sistemas Embarcados e de Tempo Real (SETR)',
    },
    {
      name: 'Diego Zabot',
      presentation:
        'Stimulating the development of Computational Reasoning by game design strategies',
      professor: 'Ecivaldo de Souza Matos',
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Claudio Junior Nascimento da Silva',
      presentation:
        'TinyFED - Integrating Federated Learning into resource-constrained devices',
      professor: 'Cássio Vinicius Serafim Prazeres',
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Ailton Santos Ribeiro',
      presentation:
        'Rumo a Avatares Inclusivos: Um Estudo sobre a Autorrepresentação em Ambientes Virtuais',
      professor: 'Vaninha Vieira dos Santos',
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Nilson Rodrigues Sousa',
      presentation:
        'Integrated Architecture for IoT Device Management in Smart Cities',
      professor: 'Cássio Vinicius Serafim Prazeres',
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Edmilson dos Santos de Jesus',
      presentation:
        'modelo baseado em agentes para previsão da demanda de água em regiões metropolitanas',
      professor: 'Gecynalda Soares da Silva Gomes',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Guilherme Braga Araujo',
      presentation:
        'Escalabilidade e Segurança para Serviços e Aplicações em Computação de Borda Veicular Através de Redes de Dados Nomeados',
      professor: 'Leobino Nascimento Sampaio',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Bruno Souza Cabral',
      presentation:
        'ANALYSIS OF GENERATIVE AND SEQUENCE LABELING METHODS FOR PORTUGUESE OPEN INFORMATION  EXTRACTION',
      professor: 'Daniela Barreiro Claro',
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Antonio Mateus de Sousa',
      presentation:
        'ToID: Reputação Baseada em Identificadores Descentralizados Para Aplicações Distribuídas',
      professor: 'Leobino Nascimento Sampaio',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Nacles Bernardino Pirajá Gomes',
      presentation:
        'Multi-MyIntegration: framework para Integração Segura de Dados Heterogêneos com GCS e Blockchain',
      professor: 'Laís do Nascimento Salvador',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Antônio Cleber de Sousa Araújo',
      presentation: 'Arquitetura Adaptável na Camada de Enlace',
      professor: 'Leobino Nascimento Sampaio',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Elisangela Oliveira Carneiro',
      presentation:
        'Sistemas de Reputação baseados em Blockchain para ambientes IoT',
      professor: 'Cássio Vinicius Serafim Prazeres',
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Talita Rocha Pinheiro',
      presentation: '',
      professor: 'Leobino Nascimento Sampaio',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Rita de Cássia Novaes Barretto',
      presentation:
        'Além da IDE: expandindo a infraestrutura de dados espaciais por meio de blockchain',
      professor: 'George Marconi de Araújo Lima',
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Nilton Flávio Sousa Seixas',
      presentation:
        'Data-driven Decision Making Frameworks for Resource Utilization in 6G O-RAN',
      professor: 'Gustavo Bittencourt Figueiredo',
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Eduardo Ferreira da Silva',
      presentation: 'Review-based Recommender System',
      professor: 'Frederico Araújo Durão',
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
  ];

  const panelists = [];
  for (const item of panelistsAndPresentations) {
    const emailName = item.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(' ')
      .slice(0, 2)
      .join('.');
    panelists.push({
      name: item.name,
      email: `${emailName}@ufba.br`,
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    });
  }
  for (const user of panelists) {
    user.password = bcrypt.hashSync(user.password, 10);
  }

  await prisma.userAccount.createMany({
    data: panelists,
  });

  console.log('2024 Edition Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
