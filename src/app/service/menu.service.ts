import { Injectable, OnInit } from '@angular/core';
import { UserPermission } from '../common/UserPermission';
import { Menu } from '../model/Menu';
import { MenuItem } from '../model/MenuItem';
import { MenuPermission } from '../model/MenuPermission';
import { UserService } from './user.service';
import { ApplicationUser } from '../model/ApplicationUser';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private userService: UserService) { }

  fetchMenuList(): Menu[] {
    const constantMenuList: Menu[] = [
      {
        title: 'အသုံးပြုသူ အချက်အလက်',
        items: [
          {
            title: 'အချက်အလက်ကြည့်ခြင်း',
            url: '/app/profile/detail',
            permissions: [{ name: UserPermission.ANONYMOUS }]
          },
          {
            title: 'အချက်အလက်ပြင်ခြင်း',
            url: '/app/profile/edit',
            permissions: [{ name: UserPermission.ANONYMOUS }]
          }
        ]
      },
      {
        title: 'System အသုံးပြုသူ',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/app-user/create',
            permissions: [{ name: UserPermission.ADMIN }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/app-user/list',
            permissions: [{ name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'စာသင်နှစ်',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/academic-year/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/academic-year/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'စာမေးပွဲခေါင်းစဉ်',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/exam-title/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/exam-title/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'အတန်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/grade/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/grade/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'အခန်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/class/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/class/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ပြည်နယ်/တိုင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/region/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/region/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'တည်းခိုဆောင်',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/hostel/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/hostel/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ဘာသာရပ်ကြီး',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/subject-type/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/subject-type/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ဘာသာရပ်ခွဲ',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/subject/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/subject/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ဘာသာရပ်ကြီးစာမေးပွဲ',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/exam/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/exam/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ဘာသာရပ်ခွဲစာမေးပွဲ',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/exam-subject/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/exam-subject/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'စာသင်သား',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/student/create',
            permissions: [{ name: UserPermission.STUDENT_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/student/list',
            permissions: [{ name: UserPermission.STUDENT_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'အခန်း နေရာချထားခြင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/student-class/create',
            permissions: [{ name: UserPermission.STUDENT_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/student-class/list',
            permissions: [{ name: UserPermission.STUDENT_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ရောက်ရှိဖြေဆိုမည့် စာရင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/arrival/create',
            permissions: [{ name: UserPermission.STUDENT_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/arrival/list',
            permissions: [{ name: UserPermission.STUDENT_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'တည်းခိုဆောင် နေရာချထားခြင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/student-hostel/create',
            permissions: [{ name: UserPermission.HOSTEL_ATTENDANCE_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/student-hostel/list',
            permissions: [{ name: UserPermission.HOSTEL_ATTENDANCE_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'စာမေးပွဲကတ် ထုတ်ခြင်း',
        items: [
          {
            title: 'ဖြေဆိုခွင့်ကတ်ထုတ်ခြင်း',
            url: '/app/student-card/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'အောင်လက်မှတ်ထုတ်ခြင်း',
            url: '/app/certificate/create',
            permissions: [{ name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ဖြေဆိုသူစာရင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/attendance/create',
            permissions: [{ name: UserPermission.ATTENDANCE_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/attendance/list',
            permissions: [{ name: UserPermission.ATTENDANCE_ENTRY }, { name: UserPermission.ADMIN }, { name: UserPermission.EXAM_MARK_ENTRY }]
          }
        ]
      },
      {
        title: 'စာမေးပွဲအမှတ်စာရင်း',
        items: [
          {
            title: 'အမှတ်စာရင်းကြည့်ခြင်း',
            url: '/app/student-exam/list',
            permissions: [{ name: UserPermission.EXAM_MARK_ENTRY }, { name: UserPermission.ADMIN }]
          },
          {
            title: 'ကုစားစာရင်းကြည့်ခြင်း',
            url: '/app/student-exam-moderate/list',
            permissions: [{ name: UserPermission.EXAM_MARK_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ဆုပေးစာရင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/award/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/award/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      },
      {
        title: 'ပြစ်ဒဏ်ပေးစာရင်း',
        items: [
          {
            title: 'အသစ်သွင်းခြင်း',
            url: '/app/punishment/create',
            permissions: [{ name: UserPermission.EXAM_ENTRY }]
          },
          {
            title: 'စာရင်းကြည့်ခြင်း',
            url: '/app/punishment/list',
            permissions: [{ name: UserPermission.EXAM_ENTRY }, { name: UserPermission.ADMIN }]
          }
        ]
      }
    ];

    let unFilteredMenuList: Menu[] = constantMenuList;
    let profileInfo: ApplicationUser = this.userService.fetchUserProfileInfo();
    let sessionPermission = profileInfo.role.name.toUpperCase();
    //Menu items will be shown as per User Permission
    //ANONYMOUS means Any Authorized User Permission
    //don't change the following code
    return unFilteredMenuList.map((menu: Menu) => {
      let subMenuitems = menu.items.filter((subMenu: MenuItem) => {
        let subMenuPermissions = subMenu.permissions.filter((menuPermission: MenuPermission) => {
          return (menuPermission.name === UserPermission.ANONYMOUS || menuPermission.name === sessionPermission);
        });
        return subMenuPermissions.length != 0;
      });
      menu.items = subMenuitems;
      return menu;
    }).filter((menu: Menu) => {
      return menu.items.length != 0;
    });
    //End of Menu Filter
  }

}
