import { HttpStatusCode } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export function showError(toastrService: ToastrService, router: Router, error: any) {

    if (error.status == HttpStatusCode.Unauthorized) {
        localStorage.clear();
        router.navigate(['/error', HttpStatusCode.Unauthorized]);
    } else if (error.status == HttpStatusCode.Forbidden) {
        toastrService.error("This action is forbidden.", "Forbidden Access");
    } else if (error.status >= 400 && error.status < 500) {
        toastrService.error("Something went wrong.", "Client Error");
    } else if (error.status >= 500) {
        toastrService.error("Please contact administrator.", "Server Error");
    } else {
        toastrService.error("Something went wrong.", "Unknown Error");
    }

}

