/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import Promise = monaco.Promise;
import Thenable = monaco.Thenable;
import IWorkerContext = monaco.worker.IWorkerContext;

import * as jsonService from 'vscode-json-languageservice';
import * as ls from 'vscode-languageserver-types';


class PromiseAdapter<T> implements jsonService.Thenable<T> {
	private wrapped: monaco.Promise<T>;

	constructor(executor: (resolve: (value?: T | jsonService.Thenable<T>) => void, reject: (reason?: any) => void) => void) {
		this.wrapped = new monaco.Promise<T>(executor);
	}
	public then<TResult>(onfulfilled?: (value: T) => TResult | jsonService.Thenable<TResult>, onrejected?: (reason: any) => void): jsonService.Thenable<TResult> {
		return this.wrapped.then(onfulfilled, onrejected);
	}
	public getWrapped(): monaco.Promise<T> {
		return this.wrapped;
	}
	public cancel() : void {
		this.wrapped.cancel();
	}

	public static resolve<T>(v: T) : jsonService.Thenable<T> {
		return monaco.Promise.as(v);
	}
	public static reject<T>(v: T) : jsonService.Thenable<T> {
		return monaco.Promise.wrapError(v);
	}
	public static all<T>(values: jsonService.Thenable<T>[]): jsonService.Thenable<T[]> {
		return monaco.Promise.join(values);
	}
}

function toMonacoPromise<R>(thenable: jsonService.Thenable<R>) : Thenable<R> {
	if (thenable instanceof PromiseAdapter) {
		return thenable.getWrapped();
	}
	return thenable;
}

export class JSONWorker {

	private _ctx:IWorkerContext;
	private _languageService: jsonService.LanguageService;
	private _languageSettings: jsonService.LanguageSettings;
	private _languageId: string;

	constructor(ctx:IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
		this._languageService = jsonService.getLanguageService({ promiseConstructor: PromiseAdapter });
		this._languageService.configure(this._languageSettings);
	}

    doValidation(uri: string): Thenable<ls.Diagnostic[]> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doValidation(document, jsonDocument);
	}
    doComplete(uri: string, position: ls.Position): Thenable<ls.CompletionList> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doComplete(document, position, jsonDocument);
	}
    doResolve(item: ls.CompletionItem): Thenable<ls.CompletionItem> {
		return this._languageService.doResolve(item);
	}
    doHover(uri: string, position: ls.Position): Thenable<ls.Hover> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doHover(document, position, jsonDocument);
	}
    format(uri: string, range: ls.Range, options: ls.FormattingOptions): Thenable<ls.TextEdit[]> {
		let document = this._getTextDocument(uri);
		let textEdits = this._languageService.format(document, range, options);
		return Promise.as(textEdits);
	}
    resetSchema(uri: string): Thenable<boolean> {
		return Promise.as(this._languageService.resetSchema(uri));
	}
    findDocumentSymbols(uri: string): Promise<ls.SymbolInformation[]> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let symbols = this._languageService.findDocumentSymbols(document, jsonDocument);
		return Promise.as(symbols);
	}
	private _getTextDocument(uri: string): ls.TextDocument {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
			}
		}
		return null;
	}
}

export interface ICreateData {
	languageId: string;
	languageSettings: jsonService.LanguageSettings;
}

export function create(ctx:IWorkerContext, createData: ICreateData): JSONWorker {
	return new JSONWorker(ctx, createData);
}
