import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
    providedIn: 'root'
})
export class ClientService {
    constructor(
        private router: Router,
        public http: HttpClient,
        public apiService: ApiService
    ) { }


    // addClientDetails(data: any) {
    //     return this.http.post(ApiService.AddClientDetailsURL, data);
    // }

    // getAllClientsByCompanyId(companyId: any, params?: { search?: string; limit?: number; offset?: number; sortBy?: string; sortOrder?: string; onlyAssigned?: boolean; isVip?: string; isActive?: string; isAssigned?: string }) {
    //     let httpParams = new HttpParams();
    //     if (params?.search) {
    //         httpParams = httpParams.set('search', params.search);
    //     }
    //     if (params?.limit) {
    //         httpParams = httpParams.set('limit', params.limit.toString());
    //     }
    //     if (params?.offset !== undefined) {
    //         httpParams = httpParams.set('offset', params.offset.toString());
    //     }
    //     if (params?.sortBy) {
    //         httpParams = httpParams.set('sortBy', params.sortBy);
    //     }
    //     if (params?.sortOrder) {
    //         httpParams = httpParams.set('sortOrder', params.sortOrder);
    //     }
    //     if (params?.onlyAssigned) {
    //         httpParams = httpParams.set('onlyAssigned', 'true');
    //     }
    //     if (params?.isVip !== undefined && params?.isVip !== '') {
    //         httpParams = httpParams.set('isVip', params.isVip);
    //     }
    //     if (params?.isActive !== undefined && params?.isActive !== '') {
    //         httpParams = httpParams.set('isActive', params.isActive);
    //     }
    //     if (params?.isAssigned !== undefined && params?.isAssigned !== '') {
    //         httpParams = httpParams.set('isAssigned', params.isAssigned);
    //     }
    //     return this.http.get(ApiService.GetAllClientsByCIdURL + companyId, { params: httpParams });
    // }

    // getDailyWorksClientsByCompanyId(companyId: any, params?: { search?: string; limit?: number; offset?: number }) {
    //     let httpParams = new HttpParams();
    //     if (params?.search) httpParams = httpParams.set('search', params.search);
    //     if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    //     if (params?.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    //     return this.http.get(`${ApiService.GetDailyWorksClientsByCIdURL}${companyId}/daily-works`, { params: httpParams });
    // }

    // getClientById(clientId: any) {
    //     return this.http.get(ApiService.GetClientByIdURL + clientId);
    // }

    // updateClientById(clientId: any, data: any) {
    //     return this.http.put(ApiService.UpdateClientByIdURL + clientId, data);
    // }

    // deleteClientById(clientId: any) {
    //     return this.http.delete(ApiService.DeleteClientByIdURL + clientId);
    // }

    // getClientDetailsById(clientId: any) {
    //     return this.http.get(ApiService.GetClientDetailsByIdURL + clientId);
    // }

    // getUnassignedClientsByCompanyId(companyId: any, params?: { search?: string; limit?: number; offset?: number; sortBy?: string; sortOrder?: string }) {
    //     let httpParams = new HttpParams();
    //     if (params?.search) {
    //         httpParams = httpParams.set('search', params.search);
    //     }
    //     if (params?.limit) {
    //         httpParams = httpParams.set('limit', params.limit.toString());
    //     }
    //     if (params?.offset !== undefined) {
    //         httpParams = httpParams.set('offset', params.offset.toString());
    //     }
    //     if (params?.sortBy) {
    //         httpParams = httpParams.set('sortBy', params.sortBy);
    //     }
    //     if (params?.sortOrder) {
    //         httpParams = httpParams.set('sortOrder', params.sortOrder);
    //     }
    //     return this.http.get(ApiService.GetUnassignedClientsByCIdURL + companyId, { params: httpParams });
    // }

    // getPendingClientsByCompanyId(companyId: any, params?: { search?: string; limit?: number; offset?: number; sortBy?: string; sortOrder?: string }) {
    //     let httpParams = new HttpParams();
    //     if (params?.search) {
    //         httpParams = httpParams.set('search', params.search);
    //     }
    //     if (params?.limit) {
    //         httpParams = httpParams.set('limit', params.limit.toString());
    //     }
    //     if (params?.offset !== undefined) {
    //         httpParams = httpParams.set('offset', params.offset.toString());
    //     }
    //     if (params?.sortBy) {
    //         httpParams = httpParams.set('sortBy', params.sortBy);
    //     }
    //     if (params?.sortOrder) {
    //         httpParams = httpParams.set('sortOrder', params.sortOrder);
    //     }
    //     return this.http.get(ApiService.GetPendingClientsByCIdURL + companyId, { params: httpParams });
    // }

    // getActiveClients() {
    //     return this.http.get(ApiService.GetActiveClientsURL);
    // }



    // approveClient(clientId: any) {
    //     return this.http.post(ApiService.ApproveClientURL + clientId, {});
    // }

    // rejectClient(clientId: any) {
    //     return this.http.post(ApiService.RejectClientURL + clientId, {});
    // }

    // uploadClientLogo(clientId: any, formData: FormData) {
    //     return this.http.post(ApiService.UploadClientLogoURL + clientId, formData);
    // }

    // removeClientLogo(clientId: any) {
    //     return this.http.patch(ApiService.RemoveClientLogoURL + clientId, {});
    // }

    // toggleClientActive(data: any) {
    //     return this.http.post(ApiService.ToggleClientActiveURL, data);
    // }



    // getAvailableEmployees(clientId: any) {
    //     return this.http.get(ApiService.GetAvailableEmployeesURL + clientId);
    // }

    // getAvailableForClient(clientId: any) {
    //     return this.http.get(ApiService.GetAvailableForClientURL + clientId);
    // }

    // getAssignedEmployees(clientId: any) {
    //     return this.http.get(ApiService.GetAssignedEmployeesURL + clientId);
    // }

    // // Get all employees regardless of role (unified endpoint)
    // getAllEmployees(companyId: any) {
    //     return this.http.get(ApiService.GetAvailableEmployeesURL + companyId);
    // }

    // assignUsersToClient(clientId: any, managerIds: string[], employeeIds: string[], userId: string) {
    //     return this.http.put(ApiService.AssignUsersToClientURL + clientId, {
    //         managerIds,
    //         employeeIds,
    //         userId
    //     });
    // }

    // // client dashboard  Form data
    // // Client Profile Completion
    // completeProfile(clientId: string, data: any): Observable<any> {
    //     return this.http.put(ApiService.CompleteClientProfileURL + clientId, data);
    // }

    // updateClientForm(clientId: any, data: any) {
    //     return this.http.put(ApiService.UpdateClientFormURL + clientId, data);
    // }

    // // Agency Client Type Methods
    // getAllAgencyClientTypes(companyId: string): Observable<any> {
    //     return this.http.get(ApiService.GetAllAgencyClientTypesURL + companyId);
    // }

    // getActiveAgencyClientTypes(companyId: string): Observable<any> {
    //     return this.http.get(ApiService.GetActiveClientTypesURL + companyId);
    // }

    // getAgencyClientTypeById(id: string): Observable<any> {
    //     return this.http.get(ApiService.GetAgencyClientTypeByIdURL + id);
    // }

    // createAgencyClientType(data: any): Observable<any> {
    //     return this.http.post(ApiService.CreateAgencyClientTypeURL, data);
    // }

    // updateAgencyClientType(data: any): Observable<any> {
    //     return this.http.patch(ApiService.UpdateAgencyClientTypeURL + data.id, data);
    // }

    // removeAgencyClientType(id: any, companyId: string): Observable<any> {
    //     return this.http.request('delete', ApiService.DeleteAgencyClientTypeURL + id, {
    //         body: { companyId }
    //     });
    // }

    // toggleAgencyClientTypeStatus(id: any, companyId: string): Observable<any> {
    //     return this.http.patch(ApiService.ToggleAgencyClientTypeStatusURL + id, { companyId });
    // }

    // getClientStats(companyId: string): Observable<any> {
    //     return this.http.get(ApiService.GetClientStatsURL + companyId);
    // }
}
