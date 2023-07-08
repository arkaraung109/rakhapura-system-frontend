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
        title: 'အသုံးပြုသူအချက်အလက်',
        items: [
          {
            title: 'ကိုယ်‌ရေးအချက်အလက်',
            url: '/app/profile',
            permissions: [{ name: UserPermission.ANONYMOUS }]
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
        title: 'စာမေးပွဲဖြေဆိုမည့်စာသင်သား',
        items: [
          {
            title: 'အခန်းနေရာချထားခြင်း',
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
        title: 'စာမေးပွဲ',
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
        title: 'ဘာသာရပ်ခွဲစာမေးပွဲအမှတ်ပေးစာရင်း',
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
        title: 'ရောက်ရှိဖြေဆိုမည့်စာသင်သား',
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
