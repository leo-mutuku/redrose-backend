export interface IKitchenStationRepository {
    createKitchenStation(input: any): Promise<any>;
    getKitchenStation(id: number): Promise<any>;
    updateKitchenStation(id: number, input: any): Promise<any>;
    getKitchenStations(limit: number, offset: number): Promise<any>;
}
