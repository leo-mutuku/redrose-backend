export interface IKitchenStationInteractor {
    createKitchenStation(input: any);
    getKitchenStation(id: number);
    updateKitchenStation(id: number, input: any);
    getKitchenStations(limit: number, offset: number);
}
