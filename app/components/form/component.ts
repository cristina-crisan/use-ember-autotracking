import { action } from '@ember/object';
import Component from '@glimmer/component';
import { TrackedArray, TrackedObject } from 'tracked-built-ins';
import { Item } from 'use-ember-autotracking/models/item';
import { ItemParam } from '../interface/item';

interface FormArgs { }

export default class Form extends Component<FormArgs> {
    inputList!: Array<Item>;
    colectedDataList: Array<Item> = new TrackedArray([]);
    item!:Item
    constructor(owner: unknown, args:FormArgs) {
        super(owner, args)
        const item = new Item(Date.now());
        this.inputList= new TrackedArray([item]);
    }
    get hasSingleInput (): boolean {
        return this.inputList.length === 1;
    }

    @action
    addField(): void {
        this.item = new Item(Date.now());
        this.inputList.push(this.item);
    }

    @action
    remove(item: Item, isInput: boolean): void {
        if (isInput){
            if (this.hasSingleInput) {
                return;
            }
            const inputIndex = this.inputList.findIndex(inputItem => inputItem.id === item.id);
            if (inputIndex > -1) this.inputList.splice(inputIndex, 1);
        } else {
            if (this.hasSingleInput) {
                this.inputList[0]!.value = '';
            }else{
                const inputIndex = this.inputList.findIndex(inputItem => inputItem.id === item.id);
                if (inputIndex > -1) this.inputList.splice(inputIndex, 1);   
            }
        }
        const colectedDataListIndex = this.colectedDataList.findIndex(dataItem => dataItem.id === item.id);
        if (colectedDataListIndex > -1) this.colectedDataList.splice(colectedDataListIndex, 1)
    }

    @action
    onInput(item: ItemParam, event: Event ): void {
        item.value =(event.target as HTMLInputElement).value ;
        const colectedItem = this.colectedDataList.find(x => x.id === item.id);
        if (colectedItem) {
            colectedItem.value = item.value;
        } else {
            this.colectedDataList.push(new TrackedObject(item));
        }
    }
}

