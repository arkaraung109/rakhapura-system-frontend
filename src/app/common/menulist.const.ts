import { Menu } from '../model/Menu';
import { UserPermission } from './UserPermission';

export const constantMenuList: Menu[] = [
  {
    title: 'Profile Management',
    items: [
      {
        title: 'User Profile',
        url: '/app/profile',
        permissions: [{ name: UserPermission.ANONYMOUS }]
      }
    ]
  },
  {
    title: 'Academic Year',
    items: [
      {
        title: 'Create New',
        url: '/app/academic-year/create',
        permissions: [{ name: UserPermission.EXAM_ENTRY }]
      },
      {
        title: 'View List',
        url: '/app/academic-year/list',
        permissions: [{ name: UserPermission.ANONYMOUS }]
      }
    ]
  },
  {
    title: 'Grade',
    items: [
      {
        title: 'Create New',
        url: '/app/grade/create',
        permissions: [{ name: UserPermission.EXAM_ENTRY }]
      },
      {
        title: 'View List',
        url: '/app/grade/list',
        permissions: [{ name: UserPermission.ANONYMOUS }]
      }
    ]
  },
  {
    title: 'Exam Title',
    items: [
      {
        title: 'Create New',
        url: '/app/exam-title/create',
        permissions: [{ name: UserPermission.EXAM_ENTRY }]
      },
      {
        title: 'View List',
        url: '/app/exam-title/list',
        permissions: [{ name: UserPermission.ANONYMOUS }]
      }
    ]
  },
  {
    title: 'Class',
    items: [
      {
        title: 'Create New',
        url: '/app/class/create',
        permissions: [{ name: UserPermission.EXAM_ENTRY }]
      },
      {
        title: 'View List',
        url: '/app/class/list',
        permissions: [{ name: UserPermission.ANONYMOUS }]
      }
    ]
  }
];

// const profileManagement: Menu = {
//   title: 'Profile Management',
//   items: [
//     {
//       title: 'User Profile',
//       url: '/app/profile',
//       permissions: [{ name: UserPermission.ANONYMOUS }],
//     },
//   ],
// };
// constantMenuList.push(profileManagement);

// const academicYear: Menu = {
//   title: 'Academic Year',
//   items: [
//     {
//       title: 'Create New',
//       url: '/app/academic-year/create',
//       permissions: [
//         { name: UserPermission.ADMIN },
//       ],
//     },
//     {
//       title: 'View List',
//       url: '/app/academic-year/list',
//       permissions: [{ name: UserPermission.ANONYMOUS }],
//     }
//   ],
// };
// constantMenuList.push(academicYear);

// const grade: Menu = {
//   title: 'Grade',
//   items: [
//     {
//       title: 'Create New',
//       url: '/app/grade/create',
//       permissions: [
//         { name: UserPermission.EXAM_ENTRY }
//       ]
//     },
//     {
//       title: 'View List',
//       url: '/app/grade/list',
//       permissions: [{ name: UserPermission.ANONYMOUS }]
//     }
//   ]
// };

// constantMenuList.push(grade);

// const examTitle: Menu = {
//   title: 'Exam Title',
//   items: [
//     {
//       title: 'Create New',
//       url: '/app/exam-title/create',
//       permissions: [
//         { name: UserPermission.EXAM_ENTRY }
//       ]
//     },
//     {
//       title: 'View List',
//       url: '/app/exam-title/list',
//       permissions: [{ name: UserPermission.ANONYMOUS }]
//     }
//   ]
// };

// constantMenuList.push(examTitle);

// const classes: Menu = {
//   title: 'Class',
//   items: [
//     {
//       title: 'Create New',
//       url: '/app/class/create',
//       permissions: [
//         { name: UserPermission.EXAM_ENTRY }
//       ]
//     },
//     {
//       title: 'View List',
//       url: '/app/class/list',
//       permissions: [{ name: UserPermission.ANONYMOUS }]
//     }
//   ]
// };

// constantMenuList.push(classes);

// const region: Menu = {
//   title: 'Region',
//   items: [
//     {
//       title: 'Create New',
//       url: '/app/region/create',
//       permissions: [
//         { name: UserPermission.EXAM_ENTRY }
//       ]
//     },
//     {
//       title: 'View List',
//       url: '/app/region/list',
//       permissions: [{ name: UserPermission.ANONYMOUS }]
//     }
//   ]
// };

// constantMenuList.push(region);


